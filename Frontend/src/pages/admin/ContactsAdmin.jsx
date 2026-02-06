import { useEffect, useState } from 'react';
import { getContacts } from '../../api/contacts.api';
import { useToast } from '../../store/toast.store';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';

export default function ContactsAdmin() {
    const { showSuccess } = useToast();
    const [contacts, setContacts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingContact, setEditingContact] = useState(null);
    const [deletingContact, setDeletingContact] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        designation: '',
        department: '',
        email: '',
        phone: ''
    });

    const load = async () => {
        const res = await getContacts();
        setContacts(res.data);
    };

    useEffect(() => {
        load();
    }, []);

    const openCreateModal = () => {
        setEditingContact(null);
        setFormData({
            name: '',
            designation: '',
            department: '',
            email: '',
            phone: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (contact) => {
        setEditingContact(contact);
        setFormData({
            name: contact.name,
            designation: contact.designation,
            department: contact.department,
            email: contact.email,
            phone: contact.phone
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingContact(null);
        setFormData({
            name: '',
            designation: '',
            department: '',
            email: '',
            phone: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.email.trim()) return;

        if (editingContact) {
            await api.put(`/contacts/${editingContact.id}`, formData);
            showSuccess('Contact updated successfully!');
        } else {
            await api.post('/contacts', formData);
            showSuccess('Contact created successfully!');
        }

        closeModal();
        load();
    };

    const openDeleteDialog = (contact) => {
        setDeletingContact(contact);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        await api.delete(`/contacts/${deletingContact.id}`);
        showSuccess('Contact deleted successfully!');
        setIsDeleteDialogOpen(false);
        setDeletingContact(null);
        load();
    };

    const handleToggleStatus = async (contact) => {
        await api.patch(`/contacts/${contact.id}/status`);
        showSuccess(`Contact ${contact.is_active ? 'deactivated' : 'activated'} successfully!`);
        load();
    };

    return (
        <div className="bg-itc-bg p-6 rounded-lg max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-h1 font-semibold text-itc-text-primary">
                        Contacts Management
                    </h1>
                    <p className="text-muted mt-1">
                        Manage important contacts directory
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

            {/* Contacts Table */}
            <div className="bg-itc-surface border border-itc-border rounded-md shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-itc-border">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Designation
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Department
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Contact Info
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
                        {contacts.map(contact => (
                            <tr key={contact.id} className={`hover:bg-itc-bg transition-colors ${!contact.is_active ? 'opacity-60' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-itc-text-primary">
                                        {contact.name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600">
                                        {contact.designation}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                                        {contact.department}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm space-y-1">
                                        <div className="text-itc-blue">{contact.email}</div>
                                        <div className="text-gray-600">{contact.phone}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge isActive={contact.is_active} />
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleToggleStatus(contact)}
                                        className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${contact.is_active
                                            ? 'border-orange-300 text-orange-700 bg-white hover:bg-orange-50'
                                            : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                                            }`}
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        {contact.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => openEditModal(contact)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteDialog(contact)}
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

                {contacts.length === 0 && (
                    <div className="p-8 text-center text-itc-text-secondary">
                        No contacts added yet. Click "Create New" to add one.
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingContact ? 'Edit Contact' : 'Create New Contact'}
                size="md"
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Name *
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                                placeholder="e.g., John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Designation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Designation *
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                                placeholder="e.g., Senior Manager"
                                value={formData.designation}
                                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                required
                            />
                        </div>

                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Department *
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                                placeholder="e.g., Human Resources"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                                placeholder="john.doe@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Phone *
                            </label>
                            <input
                                type="tel"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                                placeholder="+91 1234567890"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
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
                            {editingContact ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Contact"
                message={`Are you sure you want to delete "${deletingContact?.name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
}
