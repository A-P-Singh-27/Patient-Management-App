import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Save, User, Calendar, Stethoscope, Building, Bed, HeartPulse } from 'lucide-react';

export default function PatientModal({
  isOpen,
  onClose,
  onSubmit,
  patientToEdit = null,
  wards = [],
  departments = [],
  doctors = [],
  genders = ['Male', 'Female', 'Other'],
  statuses = ['Admitted', 'Discharged'],
}) {
  const todayString = new Date().toISOString().split('T')[0];

  const initialForm = {
    name: '',
    age: '',
    gender: 'Male',
    ward: wards[0] || 'General Ward (Male)',
    department: departments[0] || 'General Medicine',
    doctor: doctors[0] || '',
    admission_date: todayString,
    status: 'Admitted',
  };

  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patientToEdit) {
      setFormData({
        name: patientToEdit.name || '',
        age: patientToEdit.age?.toString() || '',
        gender: patientToEdit.gender || 'Male',
        ward: patientToEdit.ward || wards[0] || '',
        department: patientToEdit.department || departments[0] || '',
        doctor: patientToEdit.doctor || doctors[0] || '',
        admission_date: patientToEdit.admission_date || todayString,
        status: patientToEdit.status || 'Admitted',
      });
    } else {
      setFormData({
        name: '',
        age: '',
        gender: genders[0] || 'Male',
        ward: wards[0] || '',
        department: departments[0] || '',
        doctor: doctors[0] || '',
        admission_date: todayString,
        status: 'Admitted',
      });
    }
    setErrors({});
    setServerError('');
  }, [patientToEdit, isOpen, wards, departments, doctors]);

  if (!isOpen) return null;

  const validateField = (name, value) => {
    let err = '';

    if (name === 'name') {
      const trimmed = value.trim();
      if (!trimmed) {
        err = 'Patient full name is required.';
      } else if (trimmed.length < 2) {
        err = 'Name must be at least 2 characters.';
      } else if (trimmed.length > 100) {
        err = 'Name cannot exceed 100 characters.';
      } else if (!/^[A-Za-z\s]+$/.test(trimmed)) {
        err = 'Name must contain only letters and spaces (no digits or symbols).';
      }
    }

    if (name === 'age') {
      if (value === '' || value === null || value === undefined) {
        err = 'Age is required.';
      } else {
        const num = Number(value);
        if (isNaN(num)) {
          err = 'Age must be a valid number.';
        } else if (num < 0 || num > 120) {
          err = 'Age must be between 0 and 120 years.';
        }
      }
    }

    if (name === 'gender') {
      if (!value) err = 'Gender selection is required.';
    }

    if (name === 'ward') {
      if (!value) err = 'Ward selection is required.';
    }

    if (name === 'department') {
      if (!value) err = 'Department selection is required.';
    }

    if (name === 'doctor') {
      if (!value) err = 'Doctor selection is required.';
    }

    if (name === 'admission_date') {
      if (!value) {
        err = 'Admission date is required.';
      } else if (value > todayString) {
        err = 'Admission date cannot be in the future.';
      }
    }

    if (name === 'status') {
      if (!value) err = 'Admission status is required.';
    }

    return err;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const fieldError = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: fieldError }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      const err = validateField(key, formData[key]);
      if (err) newErrors[key] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        ward: formData.ward,
        department: formData.department,
        doctor: formData.doctor,
        admission_date: formData.admission_date,
        status: formData.status,
      };

      await onSubmit(payload);
      onClose();
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        setServerError(err.response.data.message || 'Validation error from server.');
      } else if (err.response?.data?.detail) {
        setServerError(
          typeof err.response.data.detail === 'string'
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
        );
      } else {
        setServerError(err.message || 'An unexpected error occurred.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden transform transition-all">
        <div className="px-6 py-4.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-teal-100 text-teal-700 flex items-center justify-center">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {patientToEdit ? 'Edit Patient Admission Details' : 'New Patient Admission'}
              </h2>
              <p className="text-xs text-slate-500">
                {patientToEdit ? `Updating Record for ID #${patientToEdit.id}` : 'Enter verified clinical admission information'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {serverError && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-rose-500" />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma (Letters and spaces only)"
                  className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                    errors.name
                      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                      : 'border-slate-300 focus:ring-teal-500'
                  }`}
                />
              </div>
              {errors.name && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Age (Years) <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="age"
                min="0"
                max="120"
                value={formData.age}
                onChange={handleChange}
                placeholder="0 - 120"
                className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.age
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-teal-500'
                }`}
              />
              {errors.age && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  {errors.age}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Gender <span className="text-rose-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                {genders.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Assigned Ward <span className="text-rose-500">*</span>
              </label>
              <select
                name="ward"
                value={formData.ward}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                {wards.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Department <span className="text-rose-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attending Doctor <span className="text-rose-500">*</span>
              </label>
              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                {doctors.map((doc) => (
                  <option key={doc} value={doc}>
                    {doc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admission Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="admission_date"
                max={todayString}
                value={formData.admission_date}
                onChange={handleChange}
                className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-lg focus:outline-none focus:ring-2 focus:bg-white transition-all ${
                  errors.admission_date
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/20'
                    : 'border-slate-300 focus:ring-teal-500'
                }`}
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">Future dates not permitted</span>
              {errors.admission_date && (
                <p className="text-[11px] text-rose-600 mt-1 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1 flex-shrink-0" />
                  {errors.admission_date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admission Status <span className="text-rose-500">*</span>
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white"
              >
                {statuses.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 active:bg-teal-800 rounded-lg shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent mr-2"></div>
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5 mr-1.5" />
                  <span>{patientToEdit ? 'Save Changes' : 'Confirm Admission'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
