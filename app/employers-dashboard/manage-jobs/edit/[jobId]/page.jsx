'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Select from 'react-select';
import initializeDB from '@/appwrite/Services/dbServices';
import useAuth from '@/app/hooks/useAuth';
import MobileMenu from "@/components/header/MobileMenu";
import DashboardHeader from "@/components/header/DashboardHeader";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import DashboardEmployerSidebar from "@/components/header/DashboardEmployerSidebar";
import BreadCrumb from '@/components/dashboard-pages/BreadCrumb';
import CopyrightFooter from '@/components/dashboard-pages/CopyrightFooter';
import MenuToggler from '@/components/dashboard-pages/MenuToggler';

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

const flattenOptions = (options) => {
  return options.reduce((acc, option) => {
    acc.push(option);
    if (option.subOptions) {
      acc.push(...option.subOptions.map(sub => ({ ...sub, parent: option.value })));
    }
    return acc;
  }, []);
};

const EditJobPage = () => {
  const router = useRouter();
  const { jobId } = useParams(); // Get jobId from the URL using useParams
  const { user } = useAuth();
  const [jobData, setJobData] = useState(null);
  const [db, setDb] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [loading, setLoading] = useState(true);

  const flatOptions = flattenOptions(catOptions);

  useEffect(() => {
    const fetchJobData = async () => {
      if (!jobId) return; // Ensure jobId is available

      try {
        const initializedDb = await initializeDB();
        setDb(initializedDb);

        if (user?.userId && jobId && initializedDb) {
          const response = await initializedDb.Jobs.get(jobId);
          setJobData(response);

          // Set the selected options based on fetched job data
          const selectedOptions = flatOptions.filter(option => response.categoryTags.includes(option.value));
          setSelectedOptions(selectedOptions);
        }
      } catch (error) {
        console.error('Error fetching job data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobData();
  }, [user, jobId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSpecialismChange = (selectedOptions) => {
    setSelectedOptions(selectedOptions);

    // Update jobData with selected options
    const updatedTags = selectedOptions.map(option => option.value);
    setJobData((prevData) => ({
      ...prevData,
      categoryTags: updatedTags,
    }));
  };

  const handleSaveJob = async (e) => {
    e.preventDefault();

    if (db && jobData) {
      try {
        const { $databaseId, $collectionId, $id, $permissions, ...validJobData } = jobData;

        await db.Jobs.update(jobId, validJobData);
        console.log('Job updated successfully');
        router.push('/employers-dashboard/manage-jobs');
      } catch (error) {
        console.error('Error updating job:', error);
      }
    }
  };

  if (loading) {
    return <p>Loading job data...</p>;
  }

  if (!jobData) {
    return <p>Fetching job data .</p>;
  }

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>

      <LoginPopup />
      <DashboardHeader />
      <MobileMenu />
      <DashboardEmployerSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Edit Job" />
          <MenuToggler />

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Edit Job</h4>
                  </div>

                  <div className="widget-content">
                    <form className="default-form" onSubmit={handleSaveJob}>
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

                        <div className="form-group col-lg-12 col-md-12">
                          <label>Specialism</label>
                          <Select
                            value={selectedOptions}
                            isMulti
                            name="specialism"
                            options={flatOptions}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleSpecialismChange}
                            placeholder="Select Specialism"
                            getOptionLabel={(option) => option.label}
                            getOptionValue={(option) => option.value}
                            isOptionDisabled={(option) => option.subOptions && option.subOptions.length > 0}
                          />
                        </div>

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

                        <div className="form-group col-lg-12 col-md-12 text-right">
                          <button className="theme-btn btn-style-one" type="submit">
                            Save Job
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CopyrightFooter />
    </div>
  );
};

export default EditJobPage;
