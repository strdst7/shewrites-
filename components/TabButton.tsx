
import React from 'react';

interface TabButtonProps {
  onClick: () => void;
  active: boolean;
  children: React.ReactNode;
}

const TabButton: React.FC<TabButtonProps> = ({ onClick, active, children }) => {
  const baseClasses = "flex items-center justify-center px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-brand-pink-300";
  const activeClasses = "bg-brand-pink-500 text-white shadow-md";
  const inactiveClasses = "bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-brand-pink-100 dark:hover:bg-brand-pink-900/30 hover:text-brand-pink-700 dark:hover:text-brand-pink-300";

  return (
    <button onClick={onClick} className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`}>
      {children}
    </button>
  );
};

export default TabButton;
