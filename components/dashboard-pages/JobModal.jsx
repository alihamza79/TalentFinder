// components/JobModal.jsx
import React from "react";

const JobModal = ({ isOpen, onClose, job }) => {
  if (!isOpen || !job) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">{job.jobTitle}</h2>
        <p className="mb-2">
          <strong>Description:</strong> {job.jobDescription}
        </p>
        <p className="mb-2">
          <strong>Category Tags:</strong> {job.categoryTags.join(", ")}
        </p>
        <p className="mb-4">
          <strong>Salary:</strong> {job.salary}
        </p>
        <button 
          onClick={onClose} 
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default JobModal;
