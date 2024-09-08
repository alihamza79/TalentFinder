'use client';

import { useState, useEffect } from "react";
import Select from "react-select";
import { createJobsCollectionIfNotExists } from "@/global-functions/functions";
import useAuth from "@/app/hooks/useAuth";
import initializeDB from "@/appwrite/Services/dbServices";
import { ID } from "appwrite";
import categories from "@/data/categories";
import skills from "@/data/skills";

const PostBoxForm = () => {
  const { user } = useAuth();
  const [db, setDb] = useState(null);

  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobType: [],
    categoryTags: [],
    rate: "",
    skills: [],
  });

  useEffect(() => {
    const fetchDBData = async () => {
      const initializedDb = await initializeDB();
      setDb(initializedDb);
    };

    createJobsCollectionIfNotExists();
    fetchDBData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategoryChange = (selectedOptions) => {
    setJobData((prevData) => ({
      ...prevData,
      categoryTags: selectedOptions ? selectedOptions.map(option => option.value) : [],
    }));
  };

  const handleJobTypeChange = (selectedOptions) => {
    setJobData((prevData) => ({
      ...prevData,
      jobType: selectedOptions ? selectedOptions.map(option => option.value) : [],
    }));
  };

  const handleSkillsChange = (selectedOptions) => {
    setJobData((prevData) => ({
      ...prevData,
      skills: selectedOptions ? selectedOptions.map(option => option.value) : [],
    }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    if (user.userId) {
      try {
        const jobDocumentPayload = { 
          ...jobData, 
          userId: user.userId, 
          creationTime: new Date().toISOString() 
        };
        await db.jobs.create(jobDocumentPayload, ID.unique());
        console.log("Job posted successfully.");
      } catch (error) {
        console.error("Error posting job:", error);
      }
    } else {
      console.error("User ID not found.");
    }
  };

  // Flatten the options for react-select for categories
  const categoriesFlattenOptions = (options) => {
    return options.reduce((acc, option) => {
      acc.push(option);
      if (option.subOptions) {
        acc.push(...option.subOptions.map(sub => ({ ...sub, parent: option.value })));
      }
      return acc;
    }, []);
  };

  const flatOptions = categoriesFlattenOptions(categories);


  const flattenOptions = (options) => {
    return options.map(option => ({
      value: option.value,
      label: option.label,
    }));
  };

  const flatSkills = flattenOptions(skills);

  const jobTypeOptions = [
    { value: "Urgent", label: "Urgent" },
    { value: "Full Time", label: "Full Time" },
    { value: "Hybrid", label: "Hybrid" },
    { value: "Remote", label: "Remote" },
  ];

  return (
    <form className="default-form" onSubmit={handlePostJob}>
      <div className="row">
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

        <div className="form-group col-lg-6 col-md-12">
          <label>Specialisms</label>
          <Select
            value={flatOptions.filter(option => jobData.categoryTags.includes(option.value))}
            isMulti
            options={flatOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleCategoryChange}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            isOptionDisabled={(option) => option.subOptions && option.subOptions.length > 0}
          
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Job Type</label>
          <Select
            value={jobData.jobType.map(type => jobTypeOptions.find(option => option.value === type))}
            isMulti
            options={jobTypeOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleJobTypeChange}
          />
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Offered Rate</label>
          <input 
            type="text" 
            name="rate" 
            placeholder="$1000" 
            value={jobData.rate}
            onChange={handleInputChange}
            required
          />       
        </div>

        <div className="form-group col-lg-6 col-md-12">
          <label>Skills</label>
          <Select
            value={flatSkills.filter(option => jobData.skills.includes(option.value))}
            isMulti
            options={flatSkills}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleSkillsChange}
          />
        </div>

        <div className="form-group col-lg-12 col-md-12 text-right">
          <button className="theme-btn btn-style-one" type="submit">Post Job</button>
        </div>
      </div>
    </form>
  );
};

export default PostBoxForm;