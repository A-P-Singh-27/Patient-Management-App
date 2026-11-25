import sys
import os

BACKEND_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "backend")
sys.path.insert(0, BACKEND_DIR)

from tests.test_full_suite import run_suite

if __name__ == "__main__":
    run_suite()
