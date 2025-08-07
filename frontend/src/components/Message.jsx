import React from "react";

const Message = ({ message, onClose }) => {
  if (!message) return null;

  const isError =
    message.type === "error" || message.text.toLowerCase().includes("error");
  const messageClass = isError
    ? "text-red-800 bg-red-100 border border-red-300 dark:bg-red-800 dark:text-red-100 dark:border-red-600"
    : "text-green-800 bg-green-100 border border-green-300 dark:bg-green-800 dark:text-green-100 dark:border-green-600";

  const iconClass = isError ? "ri-error-warning-line" : "ri-check-circle-line";
  const closeButtonClass = isError
    ? "text-red-600 hover:text-red-800 dark:text-red-200 dark:hover:text-red-100"
    : "text-green-600 hover:text-green-800 dark:text-green-200 dark:hover:text-green-100";

  return (
    <div className={`mb-4 p-4 rounded-lg ${messageClass}`}>
      <div className="flex items-center">
        <i className={`${iconClass} text-xl mr-2`}></i>
        <span>{message.text}</span>
        <button onClick={onClose} className={`ml-auto ${closeButtonClass}`}>
          <i className="ri-close-line text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default Message;
