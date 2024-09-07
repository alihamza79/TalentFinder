'use client';

import Link from "next/link";
import Slider from "react-slick";
import Image from "next/image";
import { useQuery } from 'react-query';
import initializeDB from "@/appwrite/Services/dbServices";
import { initializeStorageServices } from "@/appwrite/Services/storageServices";
import { useState, useEffect } from "react";

const Candidates = () => {
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
            };
          })
        );
        return candidatesData;
      }
      return [];
    },
    { enabled: !!dbServices && !!storageServices }
  );

  // Slider settings
  const settings = {
    dots: true,
    speed: 1400,
    slidesToShow: data?.length > 4 ? 4 : data?.length, // Show only the number of slides available if less than 4
    slidesToScroll: 4,
    autoplay: true,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: data?.length > 4 ? 4 : data?.length } },
      { breakpoint: 768, settings: { slidesToShow: data?.length > 3 ? 3 : data?.length } },
      { breakpoint: 600, settings: { slidesToShow: data?.length > 2 ? 2 : data?.length } },
      { breakpoint: 500, settings: { slidesToShow: 1 } },
    ],
  };
  

  if (isLoading) return <div>Loading candidates...</div>;
  if (error) return <div>Error fetching candidates</div>;

  return (
    <>
      <Slider {...settings} arrows={false}>
        {console.log(data)}
        {data?.map((candidate, index) => (
          <div className="candidate-block" key={candidate.id || index}>
            <div className="inner-box">
            <figure className="image">
  {candidate.avatar && (
    <Image
      width={90}
      height={90}
      src={candidate.avatar}
      alt={`${candidate.name}'s avatar`}
    />
  )}
</figure>

              <h4 className="name">{candidate.name}</h4>
              <span className="designation">{candidate.jobTitle}</span>
              <div className="location">
                <i className="flaticon-map-locator"></i> {candidate.location}
              </div>
              <Link
                href={`/candidates-single-v1/${candidate.id}`}
                className="theme-btn btn-style-three"
              >
                <span className="btn-title">View Profile</span>
              </Link>
            </div>
          </div>
        ))}
      </Slider>
    </>
  );
};

export default Candidates;
