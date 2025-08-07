import React from "react";

const Header = ({ user, onUploadClick, onLogout }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        GDrive - Your Files
      </h1>
      <div className="flex gap-3">
        <button
          onClick={onUploadClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          aria-label="Upload a new file"
        >
          Upload File
        </button>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex items-center"
          aria-label="Logout from your account"
        >
          <i className="ri-logout-box-line mr-2"></i>
          Logout
        </button>
      </div>
    </div>
  );
};

export default Header;
