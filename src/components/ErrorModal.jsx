import { AlertCircle, X } from "lucide-react";
import { createPortal } from "react-dom";

const ErrorModal = ({ error, onClose }) => {
  if (!error) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
  <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl animate-scale-in">
    
    {/* Header */}
    <div className="flex items-center gap-3 mb-4">
      <AlertCircle className="w-5 h-5 text-red-500" />
      <h3 className="text-base font-semibold text-gray-900">
        Something went wrong
      </h3>

      <button
        onClick={onClose}
        className="ml-auto text-gray-400 hover:text-gray-700 transition"
      >
        <X className="w-5 h-5" />
      </button>
    </div>

    {/* Message */}
    <p className="text-sm text-gray-600 leading-relaxed">
      {error}
    </p>

    {/* Action */}
    <div className="mt-6 flex justify-end">
      <button
        onClick={onClose}
        className="px-5 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
      >
        Okay
      </button>
    </div>

  </div>
</div>
,
    document.body
  );
};

export default ErrorModal;
