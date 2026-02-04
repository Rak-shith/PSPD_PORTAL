import { useToast } from '../../store/toast.store';
import Toast from './Toast';

const ToastContainer = () => {
    const { toasts, hideToast } = useToast();

    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-6 right-6 z-[9999] pointer-events-none">
            <div className="flex flex-col items-end pointer-events-auto">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        duration={toast.duration}
                        onClose={hideToast}
                    />
                ))}
            </div>
        </div>
    );
};

export default ToastContainer;
