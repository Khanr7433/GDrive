import React, { useState, useEffect } from "react";
import axios from "axios";
import FileUpload from "./components/FileUpload";
import FileGrid from "./components/FileGrid";
import Header from "./components/Header";
import Message from "./components/Message";

// Configure axios defaults
axios.defaults.baseURL = "http://localhost:3000"; // Backend URL

function App() {
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    if (isLoggedIn) {
      fetchFiles();
    }
  }, [isLoggedIn]);

  const checkAuthStatus = async () => {
    try {
      const response = await axios.get("/api/auth/status", {
        withCredentials: true,
      });
      setIsLoggedIn(response.data.isLoggedIn);
      setUser(response.data.user);
    } catch (error) {
      setIsLoggedIn(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchFiles = async () => {
    try {
      const response = await axios.get("/api/files", {
        withCredentials: true,
      });
      setFiles(response.data);
    } catch (error) {
      setMessage({
        text: "Error fetching files: " + error.message,
        type: "error",
      });
    }
  };

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });

      setMessage({
        text: "File uploaded successfully!",
        type: "success",
      });
      fetchFiles(); // Refresh file list
      setShowUpload(false);
    } catch (error) {
      setMessage({
        text: "Error uploading file: " + error.message,
        type: "error",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        "/user/logout",
        {},
        {
          withCredentials: true,
        }
      );
      setIsLoggedIn(false);
      setUser(null);
      setFiles([]);
    } catch (error) {
      setMessage({
        text: "Error logging out: " + error.message,
        type: "error",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-700 p-8 rounded-lg shadow-lg max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-6 text-gray-900 dark:text-white">
            GDrive
          </h1>
          <div className="space-y-4">
            <a
              href="/user/login"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center block"
            >
              Login
            </a>
            <a
              href="/user/register"
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded text-center block"
            >
              Register
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-800">
      <div className="p-4">
        {message && (
          <Message message={message} onClose={() => setMessage(null)} />
        )}

        <Header
          user={user}
          onUploadClick={() => setShowUpload(true)}
          onLogout={handleLogout}
        />

        <FileGrid files={files} />

        {showUpload && (
          <FileUpload
            onUpload={handleFileUpload}
            onClose={() => setShowUpload(false)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
