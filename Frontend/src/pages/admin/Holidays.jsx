import { useEffect, useState } from 'react';
import { getUnits } from '../../api/holidays.api';
import api from '../../api/axios';
import { useToast } from '../../store/toast.store';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function HolidaysAdmin() {
  const { showSuccess } = useToast();
  const [holidays, setHolidays] = useState([]);
  const [units, setUnits] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState(null);
  const [deletingHoliday, setDeletingHoliday] = useState(null);
  const [formData, setFormData] = useState({
    holiday_date: '',
    name: '',
    description: '',
    unit_ids: []
  });

  const load = async () => {
    const [holidaysRes, unitsRes] = await Promise.all([
      api.get('/holidays/all-holidays'),
      getUnits()
    ]);
    setHolidays(holidaysRes.data);
    setUnits(unitsRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreateModal = () => {
    setEditingHoliday(null);
    setFormData({
      holiday_date: '',
      name: '',
      description: '',
      unit_ids: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = async (holiday) => {
    setEditingHoliday(holiday);

    // Fetch unit associations for this holiday
    const unitsRes = await api.get(`/holidays/${holiday.id}/units`);

    setFormData({
      holiday_date: holiday.holiday_date.split('T')[0], // Format date for input
      name: holiday.name,
      description: holiday.description || '',
      unit_ids: unitsRes.data
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingHoliday(null);
    setFormData({
      holiday_date: '',
      name: '',
      description: '',
      unit_ids: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.holiday_date || !formData.name || formData.unit_ids.length === 0) return;

    if (editingHoliday) {
      await api.put(`/holidays/${editingHoliday.id}`, formData);
      showSuccess('Holiday updated successfully!');
    } else {
      await api.post('/holidays', formData);
      showSuccess('Holiday created successfully!');
    }

    closeModal();
    load();
  };

  const toggleUnit = (unitId) => {
    setFormData(prev => ({
      ...prev,
      unit_ids: prev.unit_ids.includes(unitId)
        ? prev.unit_ids.filter(id => id !== unitId)
        : [...prev.unit_ids, unitId]
    }));
  };

  const openDeleteDialog = (holiday) => {
    setDeletingHoliday(holiday);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    await api.delete(`/holidays/${deletingHoliday.id}`);
    showSuccess('Holiday deleted successfully!');
    setIsDeleteDialogOpen(false);
    setDeletingHoliday(null);
    load();
  };

  return (
    <div className="bg-itc-bg p-6 rounded-lg max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-itc-text-primary">
            Holiday Master
          </h1>
          <p className="text-muted mt-1">
            Manage holidays for different business units
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-itc-blue hover:bg-itc-blue-dark text-white px-5 py-2.5 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create New
        </button>
      </div>

      {/* Holidays Table */}
      <div className="bg-itc-surface border border-itc-border rounded-md shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-itc-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Holiday Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Business Units
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {holidays.map(holiday => (
              <tr key={holiday.id} className="hover:bg-itc-bg transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-itc-text-primary">
                    {new Date(holiday.holiday_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-itc-text-primary">
                      {holiday.name}
                    </div>
                    {holiday.description && (
                      <div className="text-sm text-gray-500">
                        {holiday.description}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {holiday.units ? holiday.units.split(', ').map((unit, idx) => (
                      <span key={idx} className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        {unit}
                      </span>
                    )) : (
                      <span className="text-sm text-gray-400">No units</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => openEditModal(holiday)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteDialog(holiday)}
                    className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {holidays.length === 0 && (
          <div className="p-8 text-center text-itc-text-secondary">
            No holidays added yet. Click "Create New" to add one.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingHoliday ? 'Edit Holiday' : 'Create New Holiday'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Holiday Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holiday Date *
              </label>
              <input
                type="date"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                value={formData.holiday_date}
                onChange={(e) => setFormData({ ...formData, holiday_date: e.target.value })}
                required
              />
            </div>

            {/* Holiday Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Holiday Name *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                placeholder="e.g., Independence Day"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Business Units */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Business Units * (Select at least one)
              </label>
              <div className="border border-gray-300 rounded-md p-3 max-h-48 overflow-y-auto">
                {units.map(unit => (
                  <label key={unit.id} className="flex items-center py-2 hover:bg-gray-50 px-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.unit_ids.includes(unit.id)}
                      onChange={() => toggleUnit(unit.id)}
                      className="mr-3 h-4 w-4 text-itc-blue focus:ring-itc-blue/30 border-gray-300 rounded"
                    />
                    <span className="text-sm text-gray-700">{unit.name}</span>
                  </label>
                ))}
              </div>
              {formData.unit_ids.length === 0 && (
                <p className="text-xs text-red-600 mt-1">Please select at least one business unit</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-itc-blue hover:bg-itc-blue-dark text-white rounded-md font-medium transition-colors"
            >
              {editingHoliday ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Holiday"
        message={`Are you sure you want to delete "${deletingHoliday?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
