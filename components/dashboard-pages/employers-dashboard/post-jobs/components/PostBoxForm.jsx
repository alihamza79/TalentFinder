'use client';

import { useState, useEffect } from "react";
import Select from "react-select";
import { createJobsCollectionIfNotExists } from "@/global-functions/functions";
import useAuth from "@/app/hooks/useAuth";
import initializeDB from "@/appwrite/Services/dbServices";
import { ID } from "appwrite";

const catOptions = [
  {
    label: "Metal Technology",
    value: "Metal Technology",
    subOptions: [
      { value: "Plant mechanic", label: "Plant mechanic" },
      { value: "CNC specialist", label: "CNC specialist" },
      { value: "Specialist for metal technology", label: "Specialist for metal technology" },
      { value: "Precision mechanic", label: "Precision mechanic" },
      { value: "Foundry mechanic", label: "Foundry mechanic" },
      { value: "Industrial mechanic", label: "Industrial mechanic" },
      { value: "Engineer - Automotive engineering", label: "Engineer - Automotive engineering" },
      { value: "Engineer - mechanical engineering", label: "Engineer - mechanical engineering" },
      { value: "Automotive mechatronics technician", label: "Automotive mechatronics technician" },
      { value: "Construction mechanic", label: "Construction mechanic" },
      { value: "Machine and plant operator", label: "Machine and plant operator" },
      { value: "Machine technology technician", label: "Machine technology technician" },
      { value: "Tool mechanic", label: "Tool mechanic" },
      { value: "Machining mechanic", label: "Machining mechanic" }
    ]
  },
  {
    label: "Welding Technology",
    value: "Welding Technology",
    subOptions: [
      { value: "Manual electric welder", label: "Manual electric welder" },
      { value: "Gas welder", label: "Gas welder" },
      { value: "High-pressure welder", label: "High-pressure welder" },
      { value: "MAG welder", label: "MAG welder" },
      { value: "MIG welder", label: "MIG welder" },
      { value: "Welding specialist", label: "Welding specialist" },
      { value: "Welding foreman", label: "Welding foreman" },
      { value: "TIG welder", label: "TIG welder" }
    ]
  },
  {
    label: "Electrical Engineering",
    value: "Electrical Engineering",
    subOptions: [
      { value: "Bachelor of Engineering Electrical Engineering", label: "Bachelor of Engineering Electrical Engineering" },
      { value: "Bachelor of Science Electrical Engineering", label: "Bachelor of Science Electrical Engineering" },
      { value: "Electrical systems fitter", label: "Electrical systems fitter" },
      { value: "Electronics technician - automation and systems engineering", label: "Electronics technician - automation and systems engineering" },
      { value: "Electronics technician - automation technology", label: "Electronics technician - automation technology" },
      { value: "Electronics technician - industrial engineering", label: "Electronics technician - industrial engineering" },
      { value: "Electronics technician - energy and building technology", label: "Electronics technician - energy and building technology" },
      { value: "Electronics technician - building and infrastructure systems", label: "Electronics technician - building and infrastructure systems" },
      { value: "Electronics technician - building systems integration", label: "Electronics technician - building systems integration" },
      { value: "Electronics technician - devices and systems", label: "Electronics technician - devices and systems" },
      { value: "Electronics technician - information and systems technology", label: "Electronics technician - information and systems technology" },
      { value: "Electronics technician - machines and drive technology (BBiG)", label: "Electronics technician - machines and drive technology (BBiG)" },
      { value: "Electronics technician - machines and drive technology (HwO)", label: "Electronics technician - machines and drive technology (HwO)" },
      { value: "Industrial electrician - operating technology", label: "Industrial electrician - operating technology" },
      { value: "Industrial electrician - devices and systems", label: "Industrial electrician - devices and systems" },
      { value: "Master of Electrical Engineering", label: "Master of Electrical Engineering" },
      { value: "Electrical engineering technician", label: "Electrical engineering technician" }
    ]
  },
  {
    label: "Mechatronics",
    value: "Mechatronics",
    subOptions: [
      { value: "Engineer - Mechatronics", label: "Engineer - Mechatronics" },
      { value: "Mechatronics engineer", label: "Mechatronics engineer" }
    ]
  },
  { label: "Chemistry", value: "Chemistry", subOptions: [] },
  {
    label: "IT/EDP",
    value: "IT/EDP",
    subOptions: [
      { value: "IT specialist for system integration", label: "IT specialist for system integration" },
      { value: "Computer scientist", label: "Computer scientist" },
      { value: "Engineer - Information and communication technology", label: "Engineer - Information and communication technology" },
      { value: "IT administrator", label: "IT administrator" },
      { value: "Media computer scientist", label: "Media computer scientist" },
      { value: "Computer science technician", label: "Computer science technician" }
    ]
  },
  {
    label: "Software Development",
    value: "Software Development",
    subOptions: [
      { value: "Backend Developer", label: "Backend Developer" },
      { value: "Database developer", label: "Database developer" },
      { value: "IT specialist for application development", label: "IT specialist for application development" },
      { value: "Frontend developer", label: "Frontend developer" },
      { value: "Full-Stack Developer", label: "Full-Stack Developer" }
    ]
  },
  { label: "Warehouse Logistics", value: "Warehouse Logistics", subOptions: [] }
];

const PostBoxForm = () => {
  const { user } = useAuth();
  const [db, setDb] = useState(null);

  const [jobData, setJobData] = useState({
    jobTitle: "",
    jobDescription: "",
    jobType: "",
    categoryTags: [],  // This will store an array of selected category and sub-options values
    salary: "",
  });

  useEffect(() => {
    const fetchDBData = async () => {
      const initializedDb = await initializeDB();
      setDb(initializedDb);
    };

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
      categoryTags: selectedOptions ? selectedOptions.map(option => option.value) : [],
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

  // Flatten the options for react-select
  const flattenOptions = (options) => {
    return options.reduce((acc, option) => {
      acc.push(option);
      if (option.subOptions) {
        acc.push(...option.subOptions.map(sub => ({ ...sub, parent: option.value })));
      }
      return acc;
    }, []);
  };

  const flatOptions = flattenOptions(catOptions);

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
          <label>Specialisms</label>
          <Select
            value={flatOptions.filter(option => jobData.categoryTags.includes(option.value))}
            isMulti
            name="categoryTags"
            options={flatOptions}
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={handleCategoryChange}
            getOptionLabel={(option) => option.label}
            getOptionValue={(option) => option.value}
            isOptionDisabled={(option) => option.subOptions && option.subOptions.length > 0}
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
