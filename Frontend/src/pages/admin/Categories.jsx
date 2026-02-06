import { useEffect, useState } from 'react';
import { getCategories, createCategory } from '../../api/categories.api';
import { useToast } from '../../store/toast.store';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusBadge from '../../components/common/StatusBadge';
import ValidatedInput from '../../components/common/ValidatedInput';
import { validateInput, sanitizeFormData } from '../../utils/validation';
import api from '../../api/axios';

export default function CategoriesAdmin() {
  const { showSuccess, showError } = useToast();
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);

  // Form state with validation
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const load = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setErrors({});
    setTouched({});
    setIsModalOpen(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || ''
    });
    setErrors({});
    setTouched({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setErrors({});
    setTouched({});
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const ruleType = name === 'name' ? 'name' : 'description';
      const validation = validateInput(value, ruleType);
      setErrors(prev => ({ ...prev, [name]: validation.valid ? '' : validation.message }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));

    // Validate on blur
    const ruleType = name === 'name' ? 'name' : 'description';
    const validation = validateInput(formData[name] || '', ruleType);
    setErrors(prev => ({ ...prev, [name]: validation.valid ? '' : validation.message }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Validate name
    const nameValidation = validateInput(formData.name, 'name');
    if (!nameValidation.valid) {
      newErrors.name = nameValidation.message;
    }

    // Validate description (optional but if provided, must be valid)
    if (formData.description) {
      const descValidation = validateInput(formData.description, 'description');
      if (!descValidation.valid) {
        newErrors.description = descValidation.message;
      }
    }

    setErrors(newErrors);
    setTouched({ name: true, description: true });

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!validateForm()) {
      showError('Please fix the validation errors');
      return;
    }

    try {
      // Sanitize form data before submission
      const sanitizedData = sanitizeFormData(formData);

      if (editingCategory) {
        // Update
        await api.put(`/categories/${editingCategory.id}`, sanitizedData);
        showSuccess('Category updated successfully!');
      } else {
        // Create
        await createCategory(sanitizedData);
        showSuccess('Category created successfully!');
      }

      closeModal();
      load();
    } catch (error) {
      showError(error.response?.data?.message || 'An error occurred');
    }
  };

  const openDeleteDialog = (category) => {
    setDeletingCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    await api.delete(`/categories/${deletingCategory.id}`);
    showSuccess('Category deleted successfully!');
    setIsDeleteDialogOpen(false);
    setDeletingCategory(null);
    load();
  };

  const handleToggleStatus = async (category) => {
    await api.patch(`/categories/${category.id}/status`);
    showSuccess(`Category ${category.is_active ? 'deactivated' : 'activated'} successfully!`);
    load();
  };

  return (
    <div className="bg-itc-bg p-6 rounded-lg max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-itc-text-primary">
            Category Master
          </h1>
          <p className="text-muted mt-1">
            Manage application categories used across the portal
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

      {/* Categories Table */}
      <div className="bg-itc-surface border border-itc-border rounded-md shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-itc-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category Name
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
            {categories.map(category => (
              <tr key={category.id} className={`hover:bg-itc-bg transition-colors ${!category.is_active ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4">
                  <span className="font-medium text-itc-text-primary">
                    {category.name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge isActive={category.is_active} />
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleToggleStatus(category)}
                    className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${category.is_active
                      ? 'border-orange-300 text-orange-700 bg-white hover:bg-orange-50'
                      : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                      }`}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {category.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => openEditModal(category)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteDialog(category)}
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

        {categories.length === 0 && (
          <div className="p-8 text-center text-itc-text-secondary">
            No categories created yet. Click "Create New" to add one.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingCategory ? 'Edit Category' : 'Create New Category'}
        size="sm"
      >
        <form onSubmit={handleSubmit}>
          <ValidatedInput
            label="Category Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.name}
            touched={touched.name}
            placeholder="Enter category name (e.g., IT Services)"
            required
            maxLength={100}
            autoFocus
          />

          <ValidatedInput
            label="Description (Optional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.description}
            touched={touched.description}
            placeholder="Brief description of the category"
            maxLength={500}
          />

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
              {editingCategory ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete "${deletingCategory?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
