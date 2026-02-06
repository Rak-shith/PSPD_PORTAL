export default function StatusBadge({ isActive }) {
    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
        >
            {isActive ? 'Active' : 'Inactive'}
        </span>
    );
}
