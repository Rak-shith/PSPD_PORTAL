import { useEffect, useState } from 'react';
import { getApplications, createApplication } from '../../api/applications.api';
import { getCategories } from '../../api/categories.api';
import { useToast } from '../../store/toast.store';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import ValidatedInput, { ValidatedTextarea } from '../../components/common/ValidatedInput';
import { validateInput, sanitizeFormData } from '../../utils/validation';
import api from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';

export default function ApplicationsAdmin() {
  const { showSuccess, showError } = useToast();
  const [apps, setApps] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingApp, setEditingApp] = useState(null);
  const [deletingApp, setDeletingApp] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    url: '',
    image_url: '',
    category_id: ''
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const load = async () => {
    const [appsRes, catRes] = await Promise.all([
      getApplications(),
      getCategories()
    ]);
    setApps(appsRes.data);
    setCategories(catRes.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreateModal = () => {
    setEditingApp(null);
    setFormData({
      name: '',
      description: '',
      url: '',
      image_url: '',
      category_id: ''
    });
    setErrors({});
    setTouched({});
    setIsModalOpen(true);
  };

  const openEditModal = (app) => {
    setEditingApp(app);
    setFormData({
      name: app.name,
      description: app.description || '',
      url: app.url,
      image_url: app.image_url || '',
      category_id: app.category_id || categories.find(c => c.name === app.category)?.id || ''
    });
    setErrors({});
    setTouched({});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingApp(null);
    setFormData({
      name: '',
      description: '',
      url: '',
      image_url: '',
      category_id: ''
    });
    setErrors({});
    setTouched({});
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) {
      const ruleType = name === 'url' || name === 'image_url' ? 'url' : name === 'description' ? 'description' : 'name';
      const validation = validateInput(value, ruleType);
      setErrors(prev => ({ ...prev, [name]: validation.valid ? '' : validation.message }));
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    const ruleType = name === 'url' || name === 'image_url' ? 'url' : name === 'description' ? 'description' : 'name';
    const validation = validateInput(formData[name] || '', ruleType);
    setErrors(prev => ({ ...prev, [name]: validation.valid ? '' : validation.message }));
  };

  const validateForm = () => {
    const newErrors = {};

    const nameValidation = validateInput(formData.name, 'name');
    if (!nameValidation.valid) newErrors.name = nameValidation.message;

    if (formData.description) {
      const descValidation = validateInput(formData.description, 'description');
      if (!descValidation.valid) newErrors.description = descValidation.message;
    }

    const urlValidation = validateInput(formData.url, 'url');
    if (!urlValidation.valid) newErrors.url = urlValidation.message;

    if (formData.image_url) {
      const imgValidation = validateInput(formData.image_url, 'url');
      if (!imgValidation.valid) newErrors.image_url = imgValidation.message;
    }

    if (!formData.category_id) newErrors.category_id = 'Category is required';

    setErrors(newErrors);
    setTouched({ name: true, description: true, url: true, image_url: true, category_id: true });
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

      if (editingApp) {
        await api.put(`/applications/${editingApp.id}`, sanitizedData);
        showSuccess('Application updated successfully!');
      } else {
        await createApplication(sanitizedData);
        showSuccess('Application created successfully!');
      }

      closeModal();
      load();
    } catch (error) {
      showError(error.response?.data?.message || 'An error occurred');
    }
  };

  const openDeleteDialog = (app) => {
    setDeletingApp(app);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    await api.delete(`/applications/${deletingApp.id}`);
    showSuccess('Application deleted successfully!');
    setIsDeleteDialogOpen(false);
    setDeletingApp(null);
    load();
  };

  const handleToggleStatus = async (app) => {
    await api.patch(`/applications/${app.id}/status`);
    showSuccess(`Application ${app.is_active ? 'deactivated' : 'activated'} successfully!`);
    load();
  };

  return (
    <div className="bg-itc-bg p-6 rounded-lg max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-itc-text-primary">
            Applications Management
          </h1>
          <p className="text-muted mt-1">
            Add and manage applications visible on the portal
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

      {/* Applications Table */}
      <div className="bg-itc-surface border border-itc-border rounded-md shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-itc-border">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Application
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
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
            {apps.map(app => (
              <tr key={app.id} className={`hover:bg-itc-bg transition-colors ${!app.is_active ? 'opacity-60' : ''}`}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {app.image_url && (
                      <img src={app.image_url} alt={app.name} className="w-8 h-8 object-contain" />
                    )}
                    <div>
                      <div className="font-medium text-itc-text-primary">
                        {app.name}
                      </div>
                      {app.description && (
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {app.description}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {app.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <a href={app.url} target="_blank" rel="noopener noreferrer" className="text-sm text-itc-blue hover:underline">
                    {app.url.length > 40 ? app.url.substring(0, 40) + '...' : app.url}
                  </a>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge isActive={app.is_active} />
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => handleToggleStatus(app)}
                    className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${app.is_active
                      ? 'border-orange-300 text-orange-700 bg-white hover:bg-orange-50'
                      : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                      }`}
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {app.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => openEditModal(app)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => openDeleteDialog(app)}
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

        {apps.length === 0 && (
          <div className="p-8 text-center text-itc-text-secondary">
            No applications added yet. Click "Create New" to add one.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingApp ? 'Edit Application' : 'Create New Application'}
        size="md"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Application Name */}
            <ValidatedInput
              label="Application Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.name}
              touched={touched.name}
              placeholder="e.g., Employee Portal"
              required
              maxLength={150}
            />

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue focus:border-transparent ${touched.category_id && errors.category_id ? 'border-red-500' : 'border-gray-300'
                  }`}
                value={formData.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
                onBlur={() => handleBlur('category_id')}
                required
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {touched.category_id && errors.category_id && (
                <p className="mt-1 text-sm text-red-600">{errors.category_id}</p>
              )}
            </div>

            {/* Description */}
            <ValidatedTextarea
              label="Description (Optional)"
              name="description"
              value={formData.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.description}
              touched={touched.description}
              placeholder="Brief description of the application"
              maxLength={1000}
              rows={3}
            />

            {/* URL */}
            <ValidatedInput
              label="Application URL"
              name="url"
              type="url"
              value={formData.url}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.url}
              touched={touched.url}
              placeholder="https://example.com"
              required
            />

            {/* Image URL */}
            <ValidatedInput
              label="Image URL (Optional)"
              name="image_url"
              type="url"
              value={formData.image_url}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.image_url}
              touched={touched.image_url}
              placeholder="https://example.com/icon.png"
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
              {editingApp ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete Application"
        message={`Are you sure you want to delete "${deletingApp?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
