'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import useAuth from "@/app/hooks/useAuth";
import initializeDB from "@/appwrite/Services/dbServices";
import * as sdk from "node-appwrite";
import JobModal from "@/components/dashboard-pages/JobModal";

const JobListingsTable = () => {
  const { user } = useAuth();
  const [db, setDb] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [jobToDelete, setJobToDelete] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const initializedDb = await initializeDB();
        setDb(initializedDb);

        if (user?.userId && initializedDb) {
          const response = await initializedDb.jobs.list([
            sdk.Query.equal("userId", user.userId),
          ]);
          setJobs(response.documents);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const handleEditJob = (jobId) => {
    router.push(`/employers-dashboard/manage-jobs/edit/${jobId}`);
  };

  const handleDeleteJob = (job) => {
    setJobToDelete(job);
    setIsConfirmationOpen(true);
  };

  const confirmDeleteJob = async () => {
    try {
      if (db && jobToDelete) {
        await db.jobs.delete(jobToDelete.$id);
        setJobs(jobs.filter(job => job.$id !== jobToDelete.$id));
        setIsConfirmationOpen(false);
        setJobToDelete(null);
      }
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>My Job Listings</h4>
      </div>

      <div className="widget-content">
        {loading ? (
          <div className="loading">Loading jobs...</div>
        ) : (
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Title</th>
                  {/* <th>Applications</th> */}
                  <th>Created</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((item) => (
                  <tr key={item.$id}>
                    <td>
                      <div className="job-block">
                        <div className="inner-box">
                          <div className="content">
                            <h4>
                              <Link href={`/job-single-v3/${item.$id}`}>
                                {item.jobTitle}
                              </Link>
                            </h4>
                          </div>
                        </div>
                      </div>
                    </td>
                    {/* <td className="applied">
                      <a href="#">3+ Applied</a>
                    </td> */}
                    <td>
                      {new Date(item.creationTime).toLocaleDateString()}
                    </td>
                    <td>
                      <div className="option-box">
                        <ul className="option-list">
                          <li>
                            <button
                              data-text="View Job"
                              onClick={() => handleViewJob(item)}
                            >
                              <span className="la la-eye"></span>
                            </button>
                          </li>
                          <li>
                            <button
                              data-text="Edit Job"
                              onClick={() => handleEditJob(item.$id)}
                            >
                              <span className="la la-pencil"></span>
                            </button>
                          </li>
                          <li>
                            <button
                              data-text="Delete Job"
                              onClick={() => handleDeleteJob(item)}
                            >
                              <span className="la la-trash"></span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Job Modal */}
      <JobModal isOpen={isModalOpen} onClose={handleCloseModal} job={selectedJob} />

      {/* Confirmation Modal */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Confirm Deletion</h2>
            <p className="mb-6">Are you sure you want to delete this job?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={confirmDeleteJob}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setIsConfirmationOpen(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobListingsTable;
