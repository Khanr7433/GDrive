import React from "react";

const FileGrid = ({ files }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getFileIcon = (mimetype) => {
    if (!mimetype) return "ri-file-line text-4xl text-gray-500";

    if (mimetype.startsWith("image/"))
      return "ri-image-line text-4xl text-blue-500";
    if (mimetype === "application/pdf")
      return "ri-file-pdf-line text-4xl text-red-500";
    if (mimetype.startsWith("video/"))
      return "ri-video-line text-4xl text-purple-500";
    if (mimetype.startsWith("audio/"))
      return "ri-music-line text-4xl text-green-500";
    if (mimetype.startsWith("text/") || mimetype === "application/json")
      return "ri-file-text-line text-4xl text-blue-500";
    if (
      mimetype.includes("zip") ||
      mimetype.includes("rar") ||
      mimetype.includes("tar")
    )
      return "ri-file-zip-line text-4xl text-yellow-600";
    if (
      mimetype.includes("document") ||
      mimetype.includes("docx") ||
      mimetype.includes("doc")
    )
      return "ri-file-word-line text-4xl text-blue-600";
    if (
      mimetype.includes("spreadsheet") ||
      mimetype.includes("xlsx") ||
      mimetype.includes("xls")
    )
      return "ri-file-excel-line text-4xl text-green-600";
    if (
      mimetype.includes("presentation") ||
      mimetype.includes("pptx") ||
      mimetype.includes("ppt")
    )
      return "ri-file-ppt-line text-4xl text-orange-500";

    return "ri-file-line text-4xl text-gray-500";
  };

  if (!files || files.length === 0) {
    return (
      <div className="text-center py-12">
        <i className="ri-folder-open-line text-6xl text-gray-400 mb-4"></i>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No files uploaded yet. Click "Upload File" to get started!
        </p>
      </div>
    );
  }

  return (
    <div className="files mt-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {files.map((file, index) => (
          <div
            key={file._id || index}
            className="group relative bg-white dark:bg-gray-700 rounded-lg shadow hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden"
          >
            {/* File Preview/Icon Container */}
            <div className="aspect-square flex items-center justify-center bg-gray-50 dark:bg-gray-600 relative">
              {file.mimetype && file.mimetype.startsWith("image/") ? (
                <>
                  <img
                    src={`http://localhost:5000/download/${file.path}`}
                    alt={file.originalname}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextElementSibling.style.display = "flex";
                    }}
                  />
                  <div className="hidden w-full h-full items-center justify-center">
                    <i className="ri-image-line text-4xl text-gray-400"></i>
                  </div>
                </>
              ) : (
                <i className={getFileIcon(file.mimetype)}></i>
              )}

              {/* Download button overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 flex items-center justify-center">
                <a
                  href={`http://localhost:5000/download/${file.path}`}
                  className="opacity-0 group-hover:opacity-100 bg-white bg-opacity-90 hover:bg-opacity-100 text-gray-800 p-2 rounded-full transition-all duration-200 transform scale-75 group-hover:scale-100"
                  download={file.originalname}
                  title={`Download ${file.originalname}`}
                >
                  <i className="ri-download-line text-xl"></i>
                </a>
              </div>
            </div>

            {/* File Info */}
            <div className="p-3">
              <h3
                className="text-sm font-medium text-gray-900 dark:text-white truncate"
                title={file.originalname}
              >
                {file.originalname}
              </h3>
              {file.size && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatFileSize(file.size)}
                </p>
              )}
              {file.createdAt && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                  {new Date(file.createdAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileGrid;
