import { useEffect, useState } from 'react';
import { getApplications, createApplication } from '../../api/applications.api';
import { getCategories } from '../../api/categories.api';
import { useToast } from '../../store/toast.store';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../api/axios';

export default function ApplicationsAdmin() {
  const { showSuccess } = useToast();
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.url.trim() || !formData.category_id) return;

    if (editingApp) {
      await api.put(`/applications/${editingApp.id}`, formData);
      showSuccess('Application updated successfully!');
    } else {
      await createApplication(formData);
      showSuccess('Application created successfully!');
    }

    closeModal();
    load();
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

  return (
    <div className="bg-itc-bg p-6 rounded-lg max-w-6xl">
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
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {apps.map(app => (
              <tr key={app.id} className="hover:bg-itc-bg transition-colors">
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
                <td className="px-6 py-4 text-right space-x-2">
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application Name *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                placeholder="e.g., Employee Portal"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category *
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                value={formData.category_id}
                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                required
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                placeholder="Brief description of the application"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Application URL *
              </label>
              <input
                type="url"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                placeholder="https://example.com"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                required
              />
            </div>

            {/* Image URL */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                placeholder="https://example.com/icon.png"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              />
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
