import Modal from '../common/Modal';

export default function AdminMenuModal({ isOpen, onClose, userRole, onNavigate }) {
    const itAdminPages = [
        {
            title: 'Contacts',
            description: 'Manage important contacts',
            icon: '👥',
            path: '/admin/contacts'
        },
        {
            title: 'Support',
            description: 'Manage support teams',
            icon: '🛟',
            path: '/admin/support'
        },
        {
            title: 'Access Requests',
            description: 'Review access requests',
            icon: '🔐',
            path: '/admin/access-requests'
        }
    ];

    const hrAdminPages = [
        {
            title: 'Categories',
            description: 'Manage application categories',
            icon: '📁',
            path: '/admin/categories'
        },
        {
            title: 'Applications',
            description: 'Manage applications directory',
            icon: '📱',
            path: '/admin/applications'
        },
        {
            title: 'Business Units',
            description: 'Manage business units',
            icon: '🏢',
            path: '/admin/units'
        },
        {
            title: 'HR Updates',
            description: 'Publish HR announcements',
            icon: '📢',
            path: '/admin/hr-updates'
        },
        {
            title: 'Holidays',
            description: 'Manage holiday calendar',
            icon: '📅',
            path: '/admin/holidays'
        }
    ];

    const pages = userRole === 'IT_ADMIN' ? itAdminPages : hrAdminPages;

    const handlePageClick = (path) => {
        onNavigate(path);
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Admin Panel"
            size="md"
        >
            <div className="space-y-2">
                <p className="text-sm text-gray-600 mb-4">
                    Select an admin page to manage:
                </p>

                <div className="grid gap-3">
                    {pages.map((page) => (
                        <button
                            key={page.path}
                            onClick={() => handlePageClick(page.path)}
                            className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:border-itc-blue hover:bg-blue-50 transition-all text-left group"
                        >
                            <div className="text-3xl flex-shrink-0">
                                {page.icon}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-semibold text-gray-900 group-hover:text-itc-blue transition-colors">
                                    {page.title}
                                </h3>
                                <p className="text-sm text-gray-600 mt-0.5">
                                    {page.description}
                                </p>
                            </div>
                            <svg
                                className="w-5 h-5 text-gray-400 group-hover:text-itc-blue transition-colors flex-shrink-0 mt-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    ))}
                </div>
            </div>
        </Modal>
    );
}
