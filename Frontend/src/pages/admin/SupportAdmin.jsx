import { useEffect, useState } from 'react';
import { getSupport } from '../../api/support.api';
import { useToast } from '../../store/toast.store';
import Modal from '../../components/common/Modal';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import api from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';

export default function SupportAdmin() {
    const { showSuccess } = useToast();
    const [teams, setTeams] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingTeam, setEditingTeam] = useState(null);
    const [deletingTeam, setDeletingTeam] = useState(null);
    const [formData, setFormData] = useState({
        team_name: '',
        description: '',
        email: '',
        phone: ''
    });

    const load = async () => {
        const res = await getSupport();
        setTeams(res.data);
    };

    useEffect(() => {
        load();
    }, []);

    const openCreateModal = () => {
        setEditingTeam(null);
        setFormData({
            team_name: '',
            description: '',
            email: '',
            phone: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (team) => {
        setEditingTeam(team);
        setFormData({
            team_name: team.team_name,
            description: team.description || '',
            email: team.email,
            phone: team.phone
        });
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingTeam(null);
        setFormData({
            team_name: '',
            description: '',
            email: '',
            phone: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.team_name.trim() || !formData.email.trim()) return;

        if (editingTeam) {
            await api.put(`/support/${editingTeam.id}`, formData);
            showSuccess('Support team updated successfully!');
        } else {
            await api.post('/support', formData);
            showSuccess('Support team created successfully!');
        }

        closeModal();
        load();
    };

    const openDeleteDialog = (team) => {
        setDeletingTeam(team);
        setIsDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        await api.delete(`/support/${deletingTeam.id}`);
        showSuccess('Support team deleted successfully!');
        setIsDeleteDialogOpen(false);
        setDeletingTeam(null);
        load();
    };

    const handleToggleStatus = async (team) => {
        await api.patch(`/support/${team.id}/status`);
        showSuccess(`Support team ${team.is_active ? 'deactivated' : 'activated'} successfully!`);
        load();
    };

    return (
        <div className="bg-itc-bg p-6 rounded-lg max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-h1 font-semibold text-itc-text-primary">
                        Support Teams Management
                    </h1>
                    <p className="text-muted mt-1">
                        Manage support directory and contact information
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

            {/* Support Teams Table */}
            <div className="bg-itc-surface border border-itc-border rounded-md shadow-sm overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-itc-border">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Team Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Description
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
                        {teams.map(team => (
                            <tr key={team.id} className={`hover:bg-itc-bg transition-colors ${!team.is_active ? 'opacity-60' : ''}`}>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-itc-text-primary">
                                        {team.team_name}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-gray-600 line-clamp-2">
                                        {team.description || '-'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm space-y-1">
                                        <div className="text-itc-blue">{team.email}</div>
                                        <div className="text-gray-600">{team.phone}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <StatusBadge isActive={team.is_active} />
                                </td>
                                <td className="px-6 py-4 text-right space-x-2">
                                    <button
                                        onClick={() => handleToggleStatus(team)}
                                        className={`inline-flex items-center px-3 py-1.5 border rounded-md text-sm font-medium transition-colors ${team.is_active
                                            ? 'border-orange-300 text-orange-700 bg-white hover:bg-orange-50'
                                            : 'border-green-300 text-green-700 bg-white hover:bg-green-50'
                                            }`}
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        {team.is_active ? 'Deactivate' : 'Activate'}
                                    </button>
                                    <button
                                        onClick={() => openEditModal(team)}
                                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => openDeleteDialog(team)}
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

                {teams.length === 0 && (
                    <div className="p-8 text-center text-itc-text-secondary">
                        No support teams added yet. Click "Create New" to add one.
                    </div>
                )}
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                title={editingTeam ? 'Edit Support Team' : 'Create New Support Team'}
                size="md"
            >
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Team Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Team Name *
                            </label>
                            <input
                                type="text"
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                                placeholder="e.g., IT Support Team"
                                value={formData.team_name}
                                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                                required
                            />
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                            </label>
                            <textarea
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-itc-blue/30"
                                placeholder="Brief description of the team's services"
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                                placeholder="support@example.com"
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
                            {editingTeam ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Delete Support Team"
                message={`Are you sure you want to delete "${deletingTeam?.team_name}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
            />
        </div>
    );
}
