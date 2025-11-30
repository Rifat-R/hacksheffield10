import { AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/button';

function DeleteConfirmModal({ isOpen, onClose, onConfirm, productName, isLoading }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-800 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <h2 className="text-xl font-bold text-white">Delete Product</h2>
          </div>
          <button
            onClick={onClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-gray-300 mb-2">
            Are you sure you want to delete this product?
          </p>
          {productName && (
            <p className="text-white font-semibold mb-4">
              "{productName}"
            </p>
          )}
          <p className="text-gray-400 text-sm">
            This action cannot be undone. The product will be permanently removed from your inventory.
          </p>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800 bg-gray-900/50">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            variant="outline"
            className="px-6 py-2 border-gray-700 text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            variant="secondary"
            className="px-6 py-2 bg-red-900 hover:bg-red-800 text-white disabled:opacity-50 disabled:cursor-not-allowed border border-red-800 hover:border-red-700"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </div>
            ) : (
              <span>Delete Product</span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
