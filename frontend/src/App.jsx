import React, { useState, useEffect, useCallback, useRef } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchAndFilters from './components/SearchAndFilters';
import PatientTable from './components/PatientTable';
import PatientModal from './components/PatientModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import KeyboardShortcutsModal from './components/KeyboardShortcutsModal';
import EmptyState from './components/EmptyState';
import ToastNotification from './components/ToastNotification';
import { patientApi } from './services/api';
import {
  DEFAULT_WARDS,
  DEFAULT_DEPARTMENTS,
  DEFAULT_DOCTORS,
  DEFAULT_GENDERS,
  STATUS_OPTIONS,
} from './constants/hospitalData';

export default function App() {
  const [patients, setPatients] = useState([]);
  const [stats, setStats] = useState({
    total_patients: 0,
    admitted_patients: 0,
    discharged_patients: 0,
    total_departments: 0,
    total_wards: 0,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedDoctor, setSelectedDoctor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Keyboard navigation & selected row index
  const [selectedIndex, setSelectedIndex] = useState(0);

  // References for keyboard focus jumps
  const searchInputRef = useRef(null);
  const wardSelectRef = useRef(null);
  const deptSelectRef = useRef(null);

  // Modals state
  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Notification state
  const [toast, setToast] = useState(null);

  const [metadata, setMetadata] = useState({
    wards: DEFAULT_WARDS,
    departments: DEFAULT_DEPARTMENTS,
    doctors: DEFAULT_DOCTORS,
    genders: DEFAULT_GENDERS,
    statuses: STATUS_OPTIONS,
  });

  const showToast = (message, type = 'success', title = '') => {
    setToast({ message, type, title });
  };

  // Search debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 200);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Load clinical metadata
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const meta = await patientApi.getMetadata();
        setMetadata({
          wards: meta.wards?.length ? meta.wards : DEFAULT_WARDS,
          departments: meta.departments?.length ? meta.departments : DEFAULT_DEPARTMENTS,
          doctors: meta.doctors?.length ? meta.doctors : DEFAULT_DOCTORS,
          genders: meta.genders?.length ? meta.genders : DEFAULT_GENDERS,
          statuses: meta.statuses?.length ? meta.statuses : STATUS_OPTIONS,
        });
      } catch (err) {
        console.warn('Using default metadata fallback:', err);
      }
    };
    fetchMeta();
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const data = await patientApi.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch statistics:', err);
    }
  }, []);

  const fetchPatients = useCallback(async () => {
    try {
      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (selectedWard !== 'ALL') params.ward = selectedWard;
      if (selectedDepartment !== 'ALL') params.department = selectedDepartment;
      if (selectedDoctor !== 'ALL') params.doctor = selectedDoctor;
      if (selectedStatus !== 'ALL') params.status = selectedStatus;

      const data = await patientApi.getPatients(params);
      setPatients(data);
      // Keep selectedIndex valid within new results length
      setSelectedIndex((prev) => (data.length > 0 ? Math.min(prev, data.length - 1) : 0));
    } catch (err) {
      console.error('Failed to load patient records:', err);
      showToast(
        err.response?.data?.message || 'Unable to connect to patient database backend.',
        'error',
        'Connection Error'
      );
    } finally {
      setIsLoading(false);
      setIsInitialLoad(false);
    }
  }, [debouncedSearch, selectedWard, selectedDepartment, selectedDoctor, selectedStatus]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedWard('ALL');
    setSelectedDepartment('ALL');
    setSelectedDoctor('ALL');
    setSelectedStatus('ALL');
    setSelectedIndex(0);
  };

  const handleOpenNewPatientModal = () => {
    setPatientToEdit(null);
    setIsPatientModalOpen(true);
  };

  const handleOpenEditPatientModal = (patient) => {
    setPatientToEdit(patient);
    setIsPatientModalOpen(true);
  };

  const handleSavePatient = async (payload) => {
    if (patientToEdit) {
      const updated = await patientApi.updatePatient(patientToEdit.id, payload);
      showToast(`Patient record for ${updated.name} updated successfully.`, 'success', 'Record Updated');
    } else {
      const created = await patientApi.createPatient(payload);
      showToast(`Patient ${created.name} successfully admitted.`, 'success', 'Admission Registered');
    }
    fetchPatients();
    fetchStats();
  };

  const handleDischargePatient = async (patient) => {
    if (!patient || patient.status === 'Discharged') return;
    try {
      await patientApi.dischargePatient(patient.id);
      showToast(`Patient ${patient.name} has been marked as Discharged.`, 'success', 'Discharge Recorded');
      fetchPatients();
      fetchStats();
    } catch (err) {
      showToast(
        err.response?.data?.detail || err.response?.data?.message || 'Failed to discharge patient.',
        'error',
        'Action Failed'
      );
    }
  };

  const handleOpenDeleteModal = (patient) => {
    if (!patient) return;
    setPatientToDelete(patient);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!patientToDelete) return;
    try {
      setIsDeleting(true);
      await patientApi.deletePatient(patientToDelete.id);
      showToast(`Patient record for ${patientToDelete.name} was permanently removed.`, 'success', 'Record Deleted');
      setIsDeleteModalOpen(false);
      setPatientToDelete(null);
      fetchPatients();
      fetchStats();
    } catch (err) {
      showToast(
        err.response?.data?.detail || 'Failed to delete patient record.',
        'error',
        'Deletion Failed'
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // --------------------------------------------------------------------------
  // PROFESSIONAL ERP KEYBOARD SHORTCUTS
  // --------------------------------------------------------------------------
  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputFocused =
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.tagName === 'SELECT' ||
          activeEl.isContentEditable);

      // ESCAPE key: universally cancels active modals, blurs inputs, closes cheatsheet
      if (e.key === 'Escape') {
        if (isPatientModalOpen) {
          setIsPatientModalOpen(false);
          return;
        }
        if (isDeleteModalOpen) {
          setIsDeleteModalOpen(false);
          return;
        }
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        if (isInputFocused) {
          activeEl.blur();
          return;
        }
        if (searchTerm) {
          setSearchTerm('');
          return;
        }
      }

      // If typing inside an input/form:
      if (isInputFocused) {
        // While search input is focused, allow direct ArrowDown, ArrowUp, and Enter to navigate/select table rows!
        if (activeEl === searchInputRef.current) {
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev < patients.length - 1 ? prev + 1 : prev));
            return;
          }
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
            return;
          }
          if (e.key === 'Enter') {
            e.preventDefault();
            const p = patients[selectedIndex];
            if (p) {
              handleOpenEditPatientModal(p);
            }
            return;
          }
        }
        return;
      }

      // If modal is open, don't trigger background dashboard navigation
      if (isPatientModalOpen || isDeleteModalOpen) {
        return;
      }

      // '?' -> Toggle Keyboard Shortcuts Cheatsheet
      if (e.key === '?') {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // 's' or '/' -> Focus search input
      if (e.key === 's' || e.key === 'S' || e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      // 'w' or 'W' -> Jump to Ward filter
      if (e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        wardSelectRef.current?.focus();
        return;
      }

      // 'p' or 'P' -> Jump to Department filter
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        deptSelectRef.current?.focus();
        return;
      }

      // 'r' or 'R' -> Reset all filters
      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleResetFilters();
        showToast('All search and dropdown filters cleared.', 'info', 'Filters Reset');
        return;
      }

      // 'n' or 'N' or 'a' -> Register New Admission
      if (e.key === 'n' || e.key === 'N' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleOpenNewPatientModal();
        return;
      }

      // Arrow Down or 'j' -> Move selection down
      if (e.key === 'ArrowDown' || e.key === 'j') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < patients.length - 1 ? prev + 1 : prev));
        return;
      }

      // Arrow Up or 'k' -> Move selection up
      if (e.key === 'ArrowUp' || e.key === 'k') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        return;
      }

      // 'e' or 'E' or 'Enter' -> Edit/View selected patient
      if (e.key === 'e' || e.key === 'E' || e.key === 'Enter') {
        e.preventDefault();
        const selectedPatient = patients[selectedIndex];
        if (selectedPatient) {
          handleOpenEditPatientModal(selectedPatient);
        }
        return;
      }

      // 'd' or 'D' -> Discharge selected patient
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        const selectedPatient = patients[selectedIndex];
        if (selectedPatient) {
          if (selectedPatient.status === 'Admitted') {
            handleDischargePatient(selectedPatient);
          } else {
            showToast(`${selectedPatient.name} is already discharged.`, 'info');
          }
        }
        return;
      }

      // 'Delete' / 'Backspace' / 'x' or 'X' -> Delete selected patient record
      if (e.key === 'Delete' || e.key === 'Backspace' || e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        const selectedPatient = patients[selectedIndex];
        if (selectedPatient) {
          handleOpenDeleteModal(selectedPatient);
        }
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [patients, selectedIndex, isPatientModalOpen, isDeleteModalOpen, isShortcutsOpen, searchTerm]);

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedWard !== 'ALL' ||
    selectedDepartment !== 'ALL' ||
    selectedDoctor !== 'ALL' ||
    selectedStatus !== 'ALL';

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans">
      {/* Sleek Zero-Waste ERP Header */}
      <Header
        onOpenNewModal={handleOpenNewPatientModal}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
      />

      {/* Main High-Density ERP Workspace */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-2.5 sm:px-4 py-2.5 sm:py-3.5 space-y-2.5">
        {/* Compact KPI & Status Filter Bar */}
        <StatsCards
          stats={stats}
          currentStatusFilter={selectedStatus}
          onSelectStatusFilter={(statusVal) => setSelectedStatus(statusVal)}
        />

        {/* Unified Search & Multi-Filter Command Bar */}
        <SearchAndFilters
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedWard={selectedWard}
          onWardChange={setSelectedWard}
          selectedDepartment={selectedDepartment}
          onDepartmentChange={setSelectedDepartment}
          selectedDoctor={selectedDoctor}
          onDoctorChange={setSelectedDoctor}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          onResetFilters={handleResetFilters}
          wards={metadata.wards}
          departments={metadata.departments}
          doctors={metadata.doctors}
          totalResults={patients.length}
          searchRef={searchInputRef}
          wardRef={wardSelectRef}
          deptRef={deptSelectRef}
        />

        {/* High-Contrast Clinical Table (Identical row layout for Tablet & Desktop) */}
        {patients.length > 0 ? (
          <PatientTable
            patients={patients}
            isLoading={isInitialLoad}
            selectedIndex={selectedIndex}
            onSelectIndex={setSelectedIndex}
            onEditPatient={handleOpenEditPatientModal}
            onOpenDeleteModal={handleOpenDeleteModal}
            onDischargePatient={handleDischargePatient}
          />
        ) : (
          !isLoading && (
            <EmptyState
              hasActiveFilters={hasActiveFilters}
              onResetFilters={handleResetFilters}
              onOpenNewModal={handleOpenNewPatientModal}
            />
          )
        )}
      </main>

      {/* Compact ERP Status Bar Footer */}
      <footer className="bg-white border-t border-slate-300 py-2.5 px-4 text-center text-[11px] text-slate-500 flex flex-col sm:flex-row items-center justify-between max-w-[1600px] w-full mx-auto">
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-700">Dscribe ERP PMS</span>
          <span>•</span>
          <span>Inpatient Admission & Ward Management</span>
        </div>
        <div className="flex items-center space-x-3 mt-1 sm:mt-0 font-medium text-slate-600">
          <span>Shortcuts: Press <kbd className="px-1 py-0.2 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-[10px]">?</kbd></span>
          <span>•</span>
          <span>Search: <kbd className="px-1 py-0.2 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-[10px]">S</kbd></span>
          <span>•</span>
          <span>Navigate: <kbd className="px-1 py-0.2 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-[10px]">↑/↓</kbd></span>
        </div>
      </footer>

      {/* Patient Add/Edit Form Modal */}
      <PatientModal
        isOpen={isPatientModalOpen}
        onClose={() => setIsPatientModalOpen(false)}
        onSubmit={handleSavePatient}
        patientToEdit={patientToEdit}
        wards={metadata.wards}
        departments={metadata.departments}
        doctors={metadata.doctors}
        genders={metadata.genders}
        statuses={metadata.statuses}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setPatientToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        patient={patientToDelete}
        isDeleting={isDeleting}
      />

      {/* Keyboard Shortcuts Cheatsheet Modal */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Toast Notification Alerts */}
      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
