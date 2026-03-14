import React, { memo } from "react";

const ProfileNavButton = memo(({ icon, label, onClick, badge }) => {
  return (
    <button
      onClick={onClick}
      className="relative flex items-center justify-between w-full px-4 py-3 text-sm font-medium transition-all duration-200 rounded-xl hover:bg-gray-100 dark:hover:bg-neutral-800 active:scale-[0.98]"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{label}</span>
      </div>

      {badge > 0 && (
        <span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-red-500 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
});

export default ProfileNavButton;