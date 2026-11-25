import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import SearchAndFilters from './components/SearchAndFilters';
import PatientTable from './components/PatientTable';
import PatientModal from './components/PatientModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
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
  const [isLoading, setIsLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedWard, setSelectedWard] = useState('ALL');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [selectedDoctor, setSelectedDoctor] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  const [metadata, setMetadata] = useState({
    wards: DEFAULT_WARDS,
    departments: DEFAULT_DEPARTMENTS,
    doctors: DEFAULT_DOCTORS,
    genders: DEFAULT_GENDERS,
    statuses: STATUS_OPTIONS,
  });

  const [isPatientModalOpen, setIsPatientModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success', title = '') => {
    setToast({ message, type, title });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm]);

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
    setIsLoading(true);
    try {
      const params = {};
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
      if (selectedWard !== 'ALL') params.ward = selectedWard;
      if (selectedDepartment !== 'ALL') params.department = selectedDepartment;
      if (selectedDoctor !== 'ALL') params.doctor = selectedDoctor;
      if (selectedStatus !== 'ALL') params.status = selectedStatus;

      const data = await patientApi.getPatients(params);
      setPatients(data);
    } catch (err) {
      console.error('Failed to load patient records:', err);
      showToast(
        err.response?.data?.message || 'Unable to connect to patient database backend.',
        'error',
        'Connection Error'
      );
    } finally {
      setIsLoading(false);
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
    try {
      await patientApi.dischargePatient(patient.id);
      showToast(`Patient ${patient.name} has been marked as Discharged.`, 'success', 'Discharge Recorded');
      fetchPatients();
      fetchStats();
    } catch (err) {
      showToast(
        err.response?.data?.detail || 'Failed to discharge patient.',
        'error',
        'Action Failed'
      );
    }
  };

  const handleOpenDeleteModal = (patient) => {
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

  const hasActiveFilters =
    searchTerm !== '' ||
    selectedWard !== 'ALL' ||
    selectedDepartment !== 'ALL' ||
    selectedDoctor !== 'ALL' ||
    selectedStatus !== 'ALL';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header onOpenNewModal={handleOpenNewPatientModal} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards
          stats={stats}
          currentStatusFilter={selectedStatus}
          onSelectStatusFilter={(statusVal) => setSelectedStatus(statusVal)}
        />

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
        />

        {patients.length > 0 ? (
          <PatientTable
            patients={patients}
            isLoading={isLoading}
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

      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500">
        <p>© 2026 CarePulse Medical Admission Management System. Built with React & FastAPI.</p>
      </footer>

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

      <ToastNotification toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
