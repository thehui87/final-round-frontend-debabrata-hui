import React from "react";
import { ArrowUpRight } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  onGetStarted: () => void;
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, onGetStarted }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white shadow-xl w-full max-w-md p-6 text-left">
        <h2 className="text-2xl font-semibold text-gray-900">Thanks for trying Ramp!</h2>

        <p className="text-gray-700 mt-4">This isn’t supported in the Ramp demo.</p>

        <p className="text-gray-700 mt-4">Ready to get started on Ramp? It only takes 5 minutes.</p>

        {/* Footer */}
        <div className="flex justify-between items-center mt-8 border-t pt-4">
          <button
            onClick={onClose}
            className="text-gray-800 underline hover:text-gray-900 hover:bg-gray-200 px-4 py-2 cursor-pointer"
          >
            Never mind
          </button>

          <button
            onClick={onGetStarted}
            className="flex items-center gap-2 bg-[#E4F222] hover:bg-[#d6e321] text-gray-900 font-medium px-5 py-2 cursor-pointer"
          >
            Get started <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
