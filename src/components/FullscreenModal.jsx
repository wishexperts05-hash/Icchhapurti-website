import PaymentModal from "../pages/PaymentModal";

export default function FullscreenModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center  ">
      {/* Close Overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full h-full max-h-screen overflow-y-auto">
       <PaymentModal />
      </div>
    </div>
  );
}
