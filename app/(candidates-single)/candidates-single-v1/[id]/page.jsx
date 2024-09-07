"use client";

import dynamic from "next/dynamic";
import LoginPopup from "@/components/common/form/login/LoginPopup";
import FooterDefault from "@/components/footer/common-footer";
import DefaulHeader from "@/components/header/DefaulHeader";
import MobileMenu from "@/components/header/MobileMenu";
import Contact from "@/components/candidates-single-pages/shared-components/Contact";
import GalleryBox from "@/components/candidates-single-pages/shared-components/GalleryBox";
import Social from "@/components/candidates-single-pages/social/Social";
import JobSkills from "@/components/candidates-single-pages/shared-components/JobSkills";
import AboutVideo from "@/components/candidates-single-pages/shared-components/AboutVideo";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation"; // Use useParams to get the dynamic id
import { useQuery } from "react-query";
import initializeDB from "@/appwrite/Services/dbServices";
import { initializeStorageServices } from "@/appwrite/Services/storageServices";
import * as sdk from "node-appwrite"; // Import the SDK properly

const CandidateSingleDynamicV1 = () => {
  const { id } = useParams(); // Get the dynamic id from URL params

  const [storageServices, setStorageServices] = useState(null);
  const [dbServices, setDbServices] = useState(null);

  // Initialize Appwrite storage and database services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        const storage = await initializeStorageServices();
        const db = await initializeDB();
        setStorageServices(storage);
        setDbServices(db);
      } catch (error) {
        console.error("Error initializing services:", error);
      }
    };
    initializeServices();
  }, []);

  // Fetch all documents and filter for the candidate with the matching id
  const { data: candidate, isLoading, error } = useQuery(
    ["candidate", id],
    async () => {
      if (dbServices?.jobSeekers && storageServices?.images && id) {
        // Fetch all documents from the jobSeekers collection
        const response = await dbServices.jobSeekers.list();

        // Find the candidate document that matches the id
        const candidateDoc = response.documents.find((doc) => doc.userId === id);

        if (!candidateDoc) {
          throw new Error("Candidate not found");
        }

        let profileImageUrl = "";
        let cvDownloadUrl = "";

        // Fetch profile image if available
        if (candidateDoc.profileImg) {
          const profileImage = await storageServices.images.getFileView(candidateDoc.profileImg);
          profileImageUrl = profileImage?.href || "";
        }

        // Fetch CV file if available
        if (candidateDoc.cv) {
          const cvDownload = await storageServices.files.getFileDownload(candidateDoc.cv);
          cvDownloadUrl = cvDownload?.href || "";
        }

        return {
          ...candidateDoc,
          profileImageUrl,
          cvDownloadUrl,
        };
      }
      return null;
    },
    {
      enabled: !!id && !!dbServices && !!storageServices,
    }
  );

  if (isLoading) return <div>Loading candidate details...</div>;
  if (error) return <div>Error fetching candidate details</div>;
  if (!candidate) return <div>No candidate found</div>;

  return (
    <>
      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="candidate-detail-section">
        <div className="upper-box">
          <div className="auto-container">
            <div className="candidate-block-five">
              <div className="inner-box">
                <div className="content">
                  <figure className="image">
                    <Image
                      width={100}
                      height={100}
                      src={candidate.profileImageUrl || "/default-avatar.jpg"}
                      alt={candidate.name}
                    />
                  </figure>
                  <h4 className="name">{candidate.name}</h4>

                  <ul className="candidate-info">
                    <li className="designation">{candidate.jobTitle}</li>
                    <li>
                      <span className="icon flaticon-map-locator"></span>
                      {candidate.city}, {candidate.country}
                    </li>
                    <li>
                      <span className="icon flaticon-money"></span> $
                      {candidate.expectedSalaryRange} / hour
                    </li>
                    <li>
                      <span className="icon flaticon-clock"></span> Member
                      Since, {candidate.registerTime}
                    </li>
                  </ul>

                  <ul className="post-tags">
                    {candidate.categoryTags?.map((tag, i) => (
                      <li key={i}>{tag}</li>
                    ))}
                  </ul>
                </div>

                <div className="btn-box">
                  <a
                    className="theme-btn btn-style-one"
                    href={candidate.cvDownloadUrl || "#"}
                    download
                  >
                    Download CV
                  </a>
                  <button className="bookmark-btn">
                    <i className="flaticon-bookmark"></i>
                  </button>
                </div>
              </div>
            </div>
            {/*  <!-- Candidate block Five --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        <div className="candidate-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <div className="job-detail">
                  <div className="video-outer">
                    <h4>Candidates About</h4>
                    <AboutVideo />
                  </div>
                  {/* <!-- About Video Box --> */}
                  <p>{candidate.description}</p>

                  {/* <!-- Portfolio --> */}
                  {/* <div className="portfolio-outer">
                    <div className="row">
                      <GalleryBox />
                    </div>
                  </div> */}

                  {/* <!-- Candidate Resume Start --> */}
                  {/* {candidateResume.map((resume) => (
                    <div
                      className={`resume-outer ${resume.themeColor}`}
                      key={resume.id}
                    >
                      <div className="upper-title">
                        <h4>{resume?.title}</h4>
                      </div> */}

                      {/* <!-- Start Resume BLock --> */}
                      {/* {resume?.blockList?.map((item) => (
                        <div className="resume-block" key={item.id}>
                          <div className="inner">
                            <span className="name">{item.meta}</span>
                            <div className="title-box">
                              <div className="info-box">
                                <h3>{item.name}</h3>
                                <span>{item.industry}</span>
                              </div>
                              <div className="edit-box">
                                <span className="year">{item.year}</span>
                              </div>
                            </div>
                            <div className="text">{item.text}</div>
                          </div>
                        </div>
                      ))} */}

                      {/* <!-- End Resume BLock --> */}
                    {/* </div>
                  ))} */}
                  {/* <!-- Candidate Resume End --> */}
                </div>
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="sidebar-widget">
                    <div className="widget-content">
                      <ul className="job-overview">
                        <li>
                          <i className="icon icon-calendar"></i>
                          <h5>Experience:</h5>
                          <span>{candidate.experience} Years</span>
                        </li>

                        <li>
                          <i className="icon icon-expiry"></i>
                          <h5>Age:</h5>
                          <span>{candidate.age} Years</span>
                        </li>

                        {/* <li>
                          <i className="icon icon-rate"></i>
                          <h5>Current Salary:</h5>
                          <span>11K - 15K</span>
                        </li> */}

                        <li>
                          <i className="icon icon-salary"></i>
                          <h5>Expected Salary:</h5>
                          <span>${candidate.expectedSalaryRange}</span>
                        </li>

                        <li>
                          <i className="icon icon-user-2"></i>
                          <h5>Gender:</h5>
                          <span>{candidate.gender}</span>
                        </li>

                        <li>
                          <i className="icon icon-language"></i>
                          <h5>Language:</h5>
<span>{Array.isArray(candidate.languages) ? candidate.languages.join(", ") : candidate.languages || "N/A"}</span>
                        </li>

                        <li>
                          <i className="icon icon-degree"></i>
                          <h5>Education Level:</h5>
                          <span>{candidate.educationalLevel}</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  {/* End .sidebar-widget conadidate overview */}

                  <div className="sidebar-widget social-media-widget">
                    <h4 className="widget-title">Social media</h4>
                    <div className="widget-content">
                      <div className="social-links">
                        <Social />
                      </div>
                    </div>
                  </div>
                  {/* End .sidebar-widget social-media-widget */}

                  <div className="sidebar-widget">
                    <h4 className="widget-title">Professional Skills</h4>
                    <div className="widget-content">
                      <ul className="job-skills">
                        <JobSkills />
                      </ul>
                    </div>
                  </div>
                  {/* End .sidebar-widget skill widget */}

                  <div className="sidebar-widget contact-widget">
                    <h4 className="widget-title">Contact Us</h4>
                    <div className="widget-content">
                      <div className="default-form">
                        <Contact />
                      </div>
                    </div>
                  </div>
                  {/* End .sidebar-widget contact-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}
            </div>
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(CandidateSingleDynamicV1), {
  ssr: false,
});
