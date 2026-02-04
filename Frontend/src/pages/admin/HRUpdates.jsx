import { useState, useEffect } from 'react';
import { createHRUpdate } from '../../api/hrUpdates.api';
import { useToast } from '../../store/toast.store';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../api/axios';

export default function HRAdminUpdates() {
  const { showSuccess } = useToast();
  const [updates, setUpdates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editingUpdate, setEditingUpdate] = useState(null);
  const [deletingUpdate, setDeletingUpdate] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    start_date: '',
    end_date: '',
    attachments: []
  });

  const load = async () => {
    const res = await api.get('/hr-updates');
    setUpdates(res.data);
  };

  useEffect(() => {
    load();
  }, []);

  const openCreateModal = () => {
    setEditingUpdate(null);
    setFormData({
      title: '',
      content: '',
      start_date: '',
      end_date: '',
      attachments: []
    });
    setIsModalOpen(true);
  };

  const openEditModal = (update) => {
    setEditingUpdate(update);
    setFormData({
      title: update.title,
      content: update.content,
      start_date: update.start_date ? update.start_date.split('T')[0] : '',
      end_date: update.end_date ? update.end_date.split('T')[0] : '',
      attachments: []
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUpdate(null);
    setFormData({
      title: '',
      content: '',
      start_date: '',
      end_date: '',
      attachments: []
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('start_date', formData.start_date);
    if (formData.end_date) {
      data.append('end_date', formData.end_date);
    }

    // Append files
    for (let i = 0; i < formData.attachments.length; i++) {
      data.append('attachments', formData.attachments[i]);
    }

    if (editingUpdate) {
      await api.put(`/hr-updates/${editingUpdate.id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      showSuccess('HR update updated successfully!');
    } else {
      await createHRUpdate(data);
      showSuccess('HR update published successfully!');
    }

    closeModal();
    load();
  };

  const openDeleteDialog = (update) => {
    setDeletingUpdate(update);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    await api.delete(`/hr-updates/${deletingUpdate.id}`);
    showSuccess('HR update deleted successfully!');
    setIsDeleteDialogOpen(false);
    setDeletingUpdate(null);
    load();
  };

  return (
    <div className="bg-itc-bg p-6 rounded-lg max-w-6xl">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-h1 font-semibold text-itc-text-primary">
            HR Updates Management
          </h1>
          <p className="text-muted mt-1">
            Publish and manage HR announcements and updates
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-itc-blue hover:bg-itc-blue-dark text-white px-5 py-2.5 rounded-md font-medium transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Publish Update
        </button>
      </div>

      {/* Updates List */}
      <div className="space-y-4">
        {updates.map(update => (
          <div key={update.id} className="bg-itc-surface border border-itc-border rounded-md p-6 shadow-sm">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-itc-text-primary mb-2">
                  {update.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">
                  {update.content}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {new Date(update.start_date).toLocaleDateString('en-GB')}
                    {update.end_date && ` - ${new Date(update.end_date).toLocaleDateString('en-GB')}`}
                  </span>
                  {update.attachments && update.attachments.length > 0 && (
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      {update.attachments.length} attachment(s)
                    </span>
                  )}
                </div>

                {/* Attachments */}
                {update.attachments && update.attachments.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">Attachments:</p>
                    <div className="flex flex-wrap gap-2">
                      {update.attachments.map(att => (
                        <a
                          key={att.id}
                          href={`http://localhost:3000${att.file_path}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-itc-blue hover:underline flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                        >
                          📎 {att.file_name}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-4 flex gap-2">
                <button
                  onClick={() => openEditModal(update)}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit
                </button>
                <button
                  onClick={() => openDeleteDialog(update)}
                  className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 bg-white hover:bg-red-50 transition-colors"
                >
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {updates.length === 0 && (
          <div className="bg-itc-surface border border-itc-border rounded-md p-8 text-center text-itc-text-secondary">
            No HR updates published yet. Click "Publish Update" to create one.
          </div>
        )}
      </div>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingUpdate ? 'Edit HR Update' : 'Publish HR Update'}
        size="lg"
      >
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                placeholder="e.g., New Policy Update"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                rows={6}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                placeholder="Enter the update content..."
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                required
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start Date *
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </div>
            </div>

            {/* Attachments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {editingUpdate ? 'Add New Attachments (Max 5 files)' : 'Attachments (Max 5 files)'}
              </label>
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                onChange={(e) => setFormData({ ...formData, attachments: e.target.files })}
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG
              </p>
              {editingUpdate && (
                <p className="text-xs text-blue-600 mt-1">
                  Note: Existing attachments will be kept. New files will be added.
                </p>
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
              {editingUpdate ? 'Update' : 'Publish'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Delete HR Update"
        message={`Are you sure you want to delete "${deletingUpdate?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
