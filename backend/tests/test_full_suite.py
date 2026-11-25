import sys
import os
import time
import urllib.request
import json
import threading
from datetime import date, timedelta

BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.insert(0, BACKEND_DIR)

import uvicorn
from app.main import app
from app.core.database import SessionLocal
from app.models.patient import Patient

import socket

def get_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(('127.0.0.1', 0))
        return s.getsockname()[1]

PORT = get_free_port()
BASE_URL = f"http://127.0.0.1:{PORT}"

def run_server():
    try:
        uvicorn.run(app, host="127.0.0.1", port=PORT, log_level="error")
    except Exception as e:
        print("Server error:", e, flush=True)

def wait_for_server(timeout=10):
    start = time.time()
    while time.time() - start < timeout:
        try:
            with urllib.request.urlopen(f"{BASE_URL}/health") as resp:
                if resp.status == 200:
                    return True
        except Exception:
            time.sleep(0.3)
    return False

def make_request(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    encoded_data = json.dumps(data).encode("utf-8") if data is not None else None
    headers = {"Content-Type": "application/json"} if data is not None else {}
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    
    try:
        with urllib.request.urlopen(req) as resp:
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content) if content else {}
    except urllib.error.HTTPError as e:
        content = e.read().decode("utf-8")
        return e.code, json.loads(content) if content else {}

def run_suite():
    print("==================================================", flush=True)
    print("   PATIENT ADMISSION MANAGEMENT - VERIFICATION    ", flush=True)
    print("==================================================", flush=True)

    # Start live background server
    t = threading.Thread(target=run_server, daemon=True)
    t.start()
    assert wait_for_server(), "Test server failed to start within timeout"

    # 1. Healthcheck
    status, body = make_request("/health")
    assert status == 200 and body["status"] == "ok"
    print("[PASS] 1. Live GET /health endpoint", flush=True)

    # 2. Metadata
    status, meta = make_request("/api/metadata")
    assert status == 200
    assert len(meta["wards"]) >= 5 and len(meta["departments"]) >= 5
    print(f"[PASS] 2. Live GET /api/metadata ({len(meta['wards'])} wards, {len(meta['departments'])} departments)", flush=True)

    # 3. Stats
    status, stats = make_request("/api/stats")
    assert status == 200 and "total_patients" in stats
    print(f"[PASS] 3. Live GET /api/stats (Total: {stats['total_patients']}, Admitted: {stats['admitted_patients']})", flush=True)

    # 4. Search
    status, patients = make_request("/api/patients?search=Arjun")
    assert status == 200 and len(patients) >= 1
    print(f"[PASS] 4. Live GET /api/patients?search=Arjun (Found: {patients[0]['name']})", flush=True)

    # 5. Filter by Department
    status, cardio = make_request("/api/patients?department=Cardiology")
    assert status == 200 and all(p["department"] == "Cardiology" for p in cardio)
    print(f"[PASS] 5. Live GET /api/patients?department=Cardiology (Found: {len(cardio)})", flush=True)

    # 6. Create Patient
    today_str = date.today().isoformat()
    new_patient = {
        "name": "Kavita Singhania",
        "age": 42,
        "gender": "Female",
        "ward": meta["wards"][0],
        "department": meta["departments"][0],
        "doctor": meta["doctors"][0],
        "admission_date": today_str,
        "status": "Admitted"
    }
    status, created = make_request("/api/patients", method="POST", data=new_patient)
    assert status == 201
    created_id = created["id"]
    print(f"[PASS] 6. Live POST /api/patients (Created ID #{created_id}: {created['name']})", flush=True)

    # 7. Update Patient
    status, updated = make_request(f"/api/patients/{created_id}", method="PUT", data={"age": 43})
    assert status == 200 and updated["age"] == 43
    print(f"[PASS] 7. Live PUT /api/patients/{created_id} (Updated age to 43)", flush=True)

    # 8. Discharge Patient
    status, discharged = make_request(f"/api/patients/{created_id}/discharge", method="PATCH")
    assert status == 200 and discharged["status"] == "Discharged"
    print(f"[PASS] 8. Live PATCH /api/patients/{created_id}/discharge (Status: Discharged)", flush=True)

    # 9. Duplicate discharge prevention (400)
    status, err = make_request(f"/api/patients/{created_id}/discharge", method="PATCH")
    assert status == 400
    print(f"[PASS] 9. Duplicate discharge rejected with 400 Bad Request", flush=True)

    # 10. Delete Patient
    status, del_resp = make_request(f"/api/patients/{created_id}", method="DELETE")
    assert status == 200
    print(f"[PASS] 10. Live DELETE /api/patients/{created_id} (Record removed)", flush=True)

    # 11. Verify 404
    status, _ = make_request(f"/api/patients/{created_id}")
    assert status == 404
    print(f"[PASS] 11. GET deleted patient returns 404 Not Found", flush=True)

    # 12. Validation: Name with digits rejected (422)
    bad_name = {**new_patient, "name": "Kavita123"}
    status, err = make_request("/api/patients", method="POST", data=bad_name)
    assert status == 422 and "name" in err.get("errors", {})
    print(f"[PASS] 12. Validation: Invalid name rejected (422: {err['errors']['name']})", flush=True)

    # 13. Validation: Future date rejected (422)
    future_date = (date.today() + timedelta(days=7)).isoformat()
    bad_date = {**new_patient, "admission_date": future_date}
    status, err = make_request("/api/patients", method="POST", data=bad_date)
    assert status == 422 and "admission_date" in err.get("errors", {})
    print(f"[PASS] 13. Validation: Future admission date rejected (422: {err['errors']['admission_date']})", flush=True)

    # 14. Validation: Age over 120 rejected (422)
    bad_age = {**new_patient, "age": 145}
    status, err = make_request("/api/patients", method="POST", data=bad_age)
    assert status == 422 and "age" in err.get("errors", {})
    print(f"[PASS] 14. Validation: Invalid age rejected (422: {err['errors']['age']})", flush=True)

    # 15. Persistence check
    db = SessionLocal()
    persistent_count = db.query(Patient).count()
    db.close()
    assert persistent_count >= 10
    print(f"[PASS] 15. Database persistence verified: SQLite stores {persistent_count} records", flush=True)

    print("==================================================", flush=True)
    print("   ALL 15 END-TO-END VERIFICATION CHECKS PASSED!  ", flush=True)
    print("==================================================", flush=True)

if __name__ == "__main__":
    run_suite()
