import React from "react";

const LogoutConfirmModal = ({ isOpen, onCancel, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-[90%] max-w-sm p-6 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl">
        <h2 className="text-lg font-semibold">Confirm Logout</h2>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Are you sure you want to logout?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm text-white bg-red-500 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmModal;