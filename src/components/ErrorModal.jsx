import { AlertCircle, X } from "lucide-react";
import { createPortal } from "react-dom";

const ErrorModal = ({ error, onClose }) => {
  if (!error) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-[#1a1a1a] border border-red-500/50 rounded-2xl p-6 w-full max-w-md shadow-2xl animate-scale-in">
        
        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0" />
          <h3 className="text-lg font-semibold text-red-300">Something went wrong</h3>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message */}
        <p className="text-red-300 text-sm leading-relaxed">
          {error}
        </p>

        {/* Action */}
        <button
          onClick={onClose}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-lg font-semibold transition"
        >
          Okay
        </button>
      </div>
    </div>,
    document.body
  );
};

export default ErrorModal;
