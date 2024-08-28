'use client';

import { useState, useEffect } from "react";
import Select from "react-select";
import { createJobsCollectionIfNotExists } from "@/global-functions/functions";
import useAuth from "@/app/hooks/useAuth";  // Use the Auth hook to get userId
import initializeDB from "@/appwrite/Services/dbServices";
import { ID } from "appwrite";
const PostBoxForm = () => {
  // const db = await initializeDB()
  const specialisms = [
    { value: "Banking", label: "Banking" },
    { value: "Digital & Creative", label: "Digital & Creative" },
    { value: "Retail", label: "Retail" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Management", label: "Management" },
    { value: "Accounting & Finance", label: "Accounting & Finance" },
    { value: "Digital", label: "Digital" },
    { value: "Creative Art", label: "Creative Art" },
  ];

  const { user } = useAuth();  // Access the logged-in userId from global auth context
  const [db, setDb] = useState(null);

  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobType: "",
    categoryTags: [],
    salary: "",
  });

  // Ensure the Jobs collection exists
  useEffect(() => {
    const fetchDBData = async ()=>{
      const initializedDb = await initializeDB();  // Await the database initialization
      setDb(initializedDb);  // Set the db state
    }

    createJobsCollectionIfNotExists();
    fetchDBData();
  }, []);

  // Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Update category tags selection
  const handleCategoryChange = (selectedOptions) => {
    setJobData((prevData) => ({
      ...prevData,
      categoryTags: selectedOptions.map(option => option.value),
    }));
  };

  // Handle form submission
  const handlePostJob = async (e) => {
    e.preventDefault();
    if (user.userId) {
      try {
        const jobDocumentPayload = { 
          ...jobData, 
          userId: user.userId, 
          creationTime: new Date().toISOString() 
        };
        await db.Jobs.create(jobDocumentPayload, ID.unique());
        console.log("Job posted successfully.");
      } catch (error) {
        console.error("Error posting job:", error);
      }
    } else {
      console.error("User ID not found.");
    }
  };

  return (
    <form className="default-form" onSubmit={handlePostJob}>
      <div className="row">
        {/* Job Title */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Title</label>
          <input 
            type="text" 
            name="jobTitle" 
            placeholder="Title" 
            value={jobData.jobTitle}
            onChange={handleInputChange}
            required
          />
        </div>

        {/* Job Description */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Job Description</label>
          <textarea 
            name="jobDescription"
            placeholder="Job Description"
            value={jobData.jobDescription}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>

        {/* Category Tags */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Specialisms </label>
          <Select
            value={specialisms.filter(option => jobData.categoryTags.includes(option.value))}
            isMulti
            name="categoryTags"
            options={specialisms}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleCategoryChange}
          />
        </div>

        {/* Job Type */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type</label>
          <select 
            name="jobType" 
            className="chosen-single form-select" 
            value={jobData.jobType}
            onChange={handleInputChange}
            required
          >
            <option value="">Select</option>
            <option value="Urgent">Urgent</option>
            <option value="Full Time">Full Time</option>
            <option value="Hybrid">Hybrid</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        {/* Salary */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Offered Salary</label>
          <input 
            type="text" 
            name="salary" 
            placeholder="$1000" 
            value={jobData.salary}
            onChange={handleInputChange}
            required
          />       
        </div>

        {/* Post Job Button */}
        <div className="form-group col-lg-12 col-md-12 text-right">
          <button className="theme-btn btn-style-one" type="submit">Post Job</button>
        </div>
      </div>
    </form>
  );
};

export default PostBoxForm;
