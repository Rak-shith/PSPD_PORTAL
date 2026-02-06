import Modal from '../common/Modal';

export default function UserProfileModal({ isOpen, onClose, user }) {
    if (!user) return null;

    const getRoleBadgeColor = (role) => {
        switch (role) {
            case 'IT_ADMIN':
                return 'bg-purple-100 text-purple-800';
            case 'HR_ADMIN':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getRoleDisplayName = (role) => {
        switch (role) {
            case 'IT_ADMIN':
                return 'IT Administrator';
            case 'HR_ADMIN':
                return 'HR Administrator';
            case 'USER':
                return 'User';
            default:
                return role;
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="User Profile"
            size="sm"
        >
            <div className="space-y-4">
                {/* Avatar */}
                <div className="flex justify-center">
                    <div className="w-20 h-20 rounded-full bg-itc-blue flex items-center justify-center text-white text-3xl font-medium">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                </div>

                {/* User Info */}
                <div className="space-y-3">
                    {/* Name */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            Name
                        </label>
                        <p className="text-base font-semibold text-gray-900">
                            {user.name || 'N/A'}
                        </p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                            Email
                        </label>
                        <p className="text-base text-gray-900">
                            {user.email || 'N/A'}
                        </p>
                    </div>

                    {/* Role */}
                    {user.role && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Role
                            </label>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(user.role)}`}>
                                {getRoleDisplayName(user.role)}
                            </span>
                        </div>
                    )}

                    {/* Employee ID if available */}
                    {user.employee_id && (
                        <div>
                            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                                Employee ID
                            </label>
                            <p className="text-base text-gray-900 font-mono">
                                {user.employee_id}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
