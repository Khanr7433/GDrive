import React, { useState } from "react";

const FileUpload = ({ onUpload, onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileSelect = (file) => {
    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert("File size exceeds 10MB limit. Please choose a smaller file.");
      return;
    }
    setSelectedFile(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedFile) {
      onUpload(selectedFile);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div
      className="fixed top-0 left-0 h-screen w-screen flex items-center justify-center z-50 backdrop-blur bg-black bg-opacity-30"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 dark:text-gray-400 text-xl hover:text-gray-700 dark:hover:text-gray-200"
          aria-label="Close upload dialog"
        >
          <i className="ri-close-line"></i>
        </button>

        <div className="flex items-center justify-center w-96">
          <label
            htmlFor="file-input"
            className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragOver
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
                : "border-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
            } dark:border-gray-600 dark:hover:border-gray-500`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            {!selectedFile ? (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <svg
                  className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 16"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                  />
                </svg>
                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Any file type supported
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <i className="ri-file-check-line text-4xl text-green-500 mb-4"></i>
                <div className="text-center">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                    {selectedFile.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {formatFileSize(selectedFile.size)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                    {selectedFile.type || "Unknown type"}
                  </p>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                  >
                    Choose different file
                  </button>
                </div>
              </div>
            )}

            <input
              id="file-input"
              type="file"
              className="hidden"
              onChange={handleFileInputChange}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={!selectedFile}
          className={`w-full mt-4 font-bold py-2 px-4 rounded transition-colors ${
            selectedFile
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-600 text-white cursor-not-allowed opacity-50"
          }`}
        >
          {selectedFile ? "Upload file" : "Select a file to upload"}
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
