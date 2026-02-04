import { useLoading } from '../../store/loading.store';

export default function GlobalLoader() {
    const { isLoading } = useLoading();

    if (!isLoading) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30 backdrop-blur-sm animate-fadeIn">
            <div className="relative">
                {/* Spinner */}
                <div className="w-16 h-16 border-4 border-itc-bg rounded-full border-t-itc-blue animate-spin"></div>

                {/* Optional: Loading text */}
                <p className="mt-4 text-white text-sm font-medium text-center">Loading...</p>
            </div>
        </div>
    );
}
