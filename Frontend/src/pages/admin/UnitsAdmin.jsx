import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useToast } from '../../store/toast.store';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';
import ValidatedInput from '../../components/common/ValidatedInput';
import { validateInput, sanitizeFormData } from '../../utils/validation';

export default function UnitsAdmin() {
    const { showSuccess, showError } = useToast();
    const [units, setUnits] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingUnit, setEditingUnit] = useState(null);
    const [deletingUnit, setDeletingUnit] = useState(null);
    const [formData, setFormData] = useState({
        code: '',
        name: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const load = async () => {
        const res = await api.get('/units');
        setUnits(res.data);
    };

    useEffect(() => {
        load();
    }, []);

    const openCreateModal = () => {
        setEditingUnit(null);
        setFormData({ code: '', name: '' });
        setErrors({});
        setTouched({});
        setIsModalOpen(true);
    };

    const openEditModal = (unit) => {
        setEditingUnit(unit);
        setFormData({ code: unit.code, name: unit.name });
        setErrors({});
        setTouched({});
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingUnit(null);
        setFormData({ code: '', name: '' });
        setErrors({});
        setTouched({});
    };

    const handleChange = (name, value) => {
        const processedValue = name === 'code' ? value.toUpperCase() : value;
        setFormData(prev => ({ ...prev, [name]: processedValue }));
        if (touched[name]) {
            const ruleType = name === 'code' ? 'code' : 'name';
            const validation = validateInput(processedValue, ruleType);
            setErrors(prev => ({ ...prev, [name]: validation.valid ? '' : validation.message }));
        }
    };

    const handleBlur = (name) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        const ruleType = name === 'code' ? 'code' : 'name';
        const validation = validateInput(formData[name] || '', ruleType);
        setErrors(prev => ({ ...prev, [name]: validation.valid ? '' : validation.message }));
    };

    const validateForm = () => {
        const newErrors = {};
        const codeValidation = validateInput(formData.code, 'code');
        if (!codeValidation.valid) newErrors.code = codeValidation.message;
        const nameValidation = validateInput(formData.name, 'name');
        if (!nameValidation.valid) newErrors.name = nameValidation.message;
        setErrors(newErrors);
        setTouched({ code: true, name: true });
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            showError('Please fix the validation errors');
            return;
        }

        try {
            const sanitizedData = sanitizeFormData(formData);
            if (editingUnit) {
                await api.put(`/units/${editingUnit.id}`, sanitizedData);
                showSuccess('Business unit updated successfully!');
            } else {
                await api.post('/units', sanitizedData);
                showSuccess('Business unit created successfully!');
            }
            closeModal();
            load();
        } catch (error) {
            showError(error.response?.data?.message || 'An error occurred');
        }
    };

    const openDeleteDialog = (unit) => {
        setDeletingUnit(unit);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        await api.delete(`/units/${deletingUnit.id}`);
        showSuccess('Business unit deleted successfully!');
        setIsDeleteDialogOpen(false);
        setDeletingUnit(null);
        load();
    };

    const handleToggleStatus = async (unit) => {
        await api.patch(`/units/${unit.id}/status`);
        showSuccess(`Unit ${unit.is_active ? 'deactivated' : 'activated'} successfully!`);
        load();
    };

    return (
        <div className="bg-itc-bg p-6 rounded-lg max-w-5xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-h1 font-semibold text-itc-text-primary">
                        Business Units
                    </h1>
                    <p className="text-muted mt-1">
                        Manage business units and divisions
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

            {/* Units Table */}
            <div className="bg-itc-surface border border-itc-border rounded-md shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-itc-border">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Code
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {units.map(unit => (
                            <tr key={unit.id} className={`hover:bg-itc-bg transition-colors ${!unit.is_active ? 'opacity-60' : ''}`}>
                                <td className="px-6 py-4">
                                    <span className="px-3 py-1 text-sm font-mono font-medium bg-blue-100 text-blue-800 rounded">
                                        {unit.code}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-itc-text-primary">
                                        {unit.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge isActive={unit.is_active} />
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleToggleStatus(unit)}
                                        className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${unit.is_active
                                            ? 'border-orange-300 text-orange-700 bg-white hover:bg-orange-50'
                                            : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                                            }`}
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        {unit.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => openEditModal(unit)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteDialog(unit)}
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

                {units.length === 0 && (
                    <div className="p-8 text-center text-itc-text-secondary">
                        No business units added yet. Click "Create New" to add one.
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingUnit ? 'Edit Business Unit' : 'Create New Business Unit'}
                size="md"
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Code */}
                        <ValidatedInput
                            label="Unit Code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.code}
                            touched={touched.code}
                            placeholder="e.g., KOVAI, TRIVEL"
                            required
                            maxLength={50}
                            className="font-mono"
                        />
                        <p className="text-xs text-gray-500 -mt-2">
                            Short code to identify the business unit (auto-uppercase)
                        </p>

                        {/* Name */}
                        <ValidatedInput
                            label="Unit Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            error={errors.name}
                            touched={touched.name}
                            placeholder="e.g., Kovai Division, Trivellore Division"
                            required
                            maxLength={100}
                        />
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
                            {editingUnit ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Business Unit"
                message={`Are you sure you want to delete "${deletingUnit?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
}
