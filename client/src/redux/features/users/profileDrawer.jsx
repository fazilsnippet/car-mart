import React, { useCallback } from "react";
import { X } from "lucide-react";

const ProfileDrawer = ({ isOpen, onClose, children }) => {
  const handleOverlayClick = useCallback(
    (e) => {
      if (e.target.id === "drawer-overlay") onClose();
    },
    [onClose]
  );

  return (
    <div
      id="drawer-overlay"
      onClick={handleOverlayClick}
      className={`fixed inset-0 z-50 transition-all duration-300 ${
        isOpen ? "bg-black/40 backdrop-blur-sm visible opacity-100" : "invisible opacity-0"
      }`}
    >
      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white dark:bg-neutral-950 shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="relative h-full overflow-y-auto">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            <X size={20} />
          </button>

          {children}
        </div>
      </div>
    </div>
  );
};

export default ProfileDrawer;