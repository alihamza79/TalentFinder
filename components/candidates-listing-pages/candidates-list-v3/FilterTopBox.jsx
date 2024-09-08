'use client'

import Link from "next/link";
import Pagination from "../components/Pagination";
import { useQuery } from 'react-query';
import initializeDB from "@/appwrite/Services/dbServices";
import { initializeStorageServices } from "@/appwrite/Services/storageServices";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import {
  addKeyword,
  addLocation,
  addSort,
  addPerPage,
  clearExperienceF,
  clearQualificationF,
  addCategory,
  addDatePost,
  addDestination,
  addCandidateGender
} from "../../../features/filter/candidateFilterSlice";
import {
  clearDatePost,
  clearExperience,
  clearQualification
} from "../../../features/candidate/candidateSlice";
import categories from "../../../data/categories"; // Import categories data

const FilterTopBox = () => {
  const {
    keyword,
    jobTitle, // New jobTitle state from LocationBox
    location,
    destination,
    category,
    candidateGender,
    datePost,
    experiences,
    qualifications,
    sort,
    perPage,
  } = useSelector((state) => state.candidateFilter) || {};

  const [storageServices, setStorageServices] = useState(null);
  const [dbServices, setDbServices] = useState(null);

  // Initialize storage and database services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        const storage = await initializeStorageServices();
        setStorageServices(storage);

        const db = await initializeDB();
        setDbServices(db);
      } catch (error) {
        console.error("Error initializing services:", error);
      }
    };

    initializeServices();
  }, []);

  // Fetch candidates from jobSeekers collection
  const { data, isLoading, error } = useQuery(
    'candidates',
    async () => {
      if (dbServices?.jobSeekers && storageServices?.images) {
        const response = await dbServices.jobSeekers.list();
        const candidatesData = await Promise.all(
          response.documents.map(async (doc) => {
            let profileImageUrl = ""; // Default image in case of error or missing image

            // Fetch profile image by ID using getFileView for a viewable URL
            if (doc.profileImg) {
              try {
                const profileImage = await storageServices.images.getFileView(doc.profileImg);
                if (profileImage.href) {
                  profileImageUrl = profileImage.href; // Get the actual image view URL
                }
              } catch (error) {
                console.error(`Error fetching profile image for candidate ${doc.name}:`, error);
              }
            }

            return {
              id: doc.userId,
              name: doc.name,
              jobTitle: doc.jobTitle,
              location: `${doc.city}, ${doc.country}`,
              avatar: profileImageUrl, // Set the avatar to either the fetched image or default
              expectedSalaryRange: doc.expectedSalaryRange, // New attribute
              categoryTags: doc.categoryTags || [], // New attribute (array of strings)
            };
          })
        );
        return candidatesData;
      }
      return [];
    },
    { enabled: !!dbServices && !!storageServices }
  );

  // keyword filter
  const keywordFilter = (item) =>
    keyword !== ""
      ? item?.name?.toLowerCase().includes(keyword?.toLowerCase()) && item
      : item;

  // jobTitle filter (from LocationBox)
  const jobTitleFilter = (item) =>
    jobTitle !== ""
      ? item?.jobTitle?.toLowerCase().includes(jobTitle?.toLowerCase()) // Match jobTitle
      : item;

  // category filter (from Categories)
  const categoryFilter = (item) => {
    if (category === "") return item; // No filter if category is not selected
    return item?.categoryTags?.some(tag => {
      const selectedCategory = categories.find(cat => cat.value === category);
      if (!selectedCategory) return false;
      return selectedCategory.subOptions.some(subCat => subCat.value === tag);
    });
  };

  // gender filter
  const genderFilter = (item) =>
    candidateGender !== ""
      ? item?.gender.toLocaleLowerCase() === candidateGender.toLocaleLowerCase()
      : item;

  // date-posted filter
  const datePostedFilter = (item) =>
    datePost !== "all" && datePost !== ""
      ? item?.created_at?.toLocaleLowerCase().split(" ").join("-").includes(datePost)
      : item;

  // experience filter
  const experienceFilter = (item) =>
    experiences?.length !== 0
      ? experiences?.includes(
          item?.experience?.split(" ").join("-").toLocaleLowerCase()
        )
      : item;

  // qualification filter
  const qualificationFilter = (item) =>
    qualifications?.length !== 0
      ? qualifications?.includes(
          item?.qualification?.split(" ").join("-").toLocaleLowerCase()
        )
      : item;

  // sort filter
  const sortFilter = (a, b) =>
    sort === "des" ? a.id > b.id && -1 : a.id < b.id && -1;

  let content = data
    ?.slice(perPage.start, perPage.end === 0 ? 10 : perPage.end)
    ?.filter(keywordFilter)
    ?.filter(jobTitleFilter) // Apply jobTitle filter
    ?.filter(categoryFilter) // Apply category filter
    ?.map((candidate, index) => (
      <div
        className="candidate-block-four col-lg-4 col-md-6 col-sm-12"
        key={candidate.id || index}
      >
        <div className="inner-box">
          <ul className="job-other-info">
            <li className="green">Featured</li>
          </ul>

          <span className="thumb">
            <Image
              width={90}
              height={90}
              src={candidate.avatar}
              alt="candidates"
            />
          </span>
          <h3 className="name">
            <Link href={`/candidates-single-v1/${candidate.id}`}>
              {candidate.name}
            </Link>
          </h3>
          <span className="cat">{candidate.jobTitle}</span>

          <ul className="job-info">
            <li>
              <span className="icon flaticon-map-locator"></span>{" "}
              {candidate.location}
            </li>
            <li>
              <span className="icon flaticon-money"></span> $
              {candidate.expectedSalaryRange} / year
            </li>
          </ul>
          {/* End candidate-info */}

          <ul className="post-tags">
            {candidate?.categoryTags?.map((val, i) => (
              <li key={i}>
                <a href="#">{val}</a>
              </li>
            ))}
          </ul>
          {/* End tags */}

          <Link
            href={`/candidates-single-v1/${candidate.id}`}
            className="theme-btn btn-style-three"
          >
            View Profile
          </Link>
        </div>
      </div>
    ));

  // sort handler
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  // per page handler
  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
  };

  // clear handler
  const clearHandler = () => {
    dispatch(addKeyword(""));
    dispatch(addLocation(""));
    dispatch(addDestination({ min: 0, max: 100 }));
    dispatch(addCategory(""));
    dispatch(addCandidateGender(""));
    dispatch(addDatePost(""));
    dispatch(clearDatePost());
    dispatch(clearExperienceF());
    dispatch(clearExperience());
    dispatch(clearQualification());
    dispatch(clearQualificationF());
    dispatch(addSort(""));
    dispatch(addPerPage({ start: 0, end: 0 }));
  };

  if (isLoading) return <div>Loading candidates...</div>;
  if (error) return <div>Error fetching candidates</div>;

  return (
    <>
      <div className="ls-switcher">
        <div className="showing-result"></div>

        <div className="sort-by">
          {keyword !== "" ||
          jobTitle !== "" || // Show clear button if jobTitle or any other filter is applied
          location !== "" ||
          destination.min !== 0 ||
          destination.max !== 100 ||
          category !== "" ||
          candidateGender !== "" ||
          datePost !== "" ||
          experiences?.length !== 0 ||
          qualifications?.length !== 0 ||
          sort !== "" ||
          perPage?.start !== 0 ||
          perPage?.end !== 0 ? (
            <button
              className="btn btn-danger text-nowrap me-2"
              style={{ minHeight: "45px", marginBottom: "15px" }}
              onClick={clearHandler}
            >
              Clear All
            </button>
          ) : undefined}

          <select
            onChange={sortHandler}
            className="chosen-single form-select"
            value={sort}
          >
            <option value="">Sort by (default)</option>
            <option value="asc">Newest</option>
            <option value="des">Oldest</option>
          </select>

          <select
            className="chosen-single form-select ms-3"
            onChange={perPageHandler}
            value={JSON.stringify(perPage)}
          >
            <option value={JSON.stringify({ start: 0, end: 0 })}>All</option>
            <option value={JSON.stringify({ start: 0, end: 15 })}>
              15 per page
            </option>
            <option value={JSON.stringify({ start: 0, end: 20 })}>
              20 per page
            </option>
            <option value={JSON.stringify({ start: 0, end: 25 })}>
              25 per page
            </option>
          </select>
        </div>
      </div>

      <div className="row">{content}</div>
      <Pagination />
    </>
  );
};

export default FilterTopBox;
