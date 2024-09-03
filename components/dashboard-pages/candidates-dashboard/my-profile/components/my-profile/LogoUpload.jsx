'use client'

import { useState, useEffect } from "react";
import { initializeStorageServices } from "@/appwrite/Services/storageServices"; 
import initializeDB from "@/appwrite/Services/dbServices";
import useAuth from "@/app/hooks/useAuth";
import * as sdk from "node-appwrite";

const LogoUpload = () => {
  const [storageServices, setStorageServices] = useState(null);
  const [dbServices, setDbServices] = useState(null);
  const [documentId, setDocumentId] = useState(null);

  const [profileImage, setProfileImage] = useState(null);
  const [cvFile, setCvFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);

  const { user } = useAuth(); // Get current user

  // Initialize storage and database services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        const storage = await initializeStorageServices();
        setStorageServices(storage);

        const db = await initializeDB();
        setDbServices(db);

        // Fetch or create jobSeeker document of the current user (by their userID)
        if (user && db.jobSeekers) {
          const response = await db.jobSeekers.list([
            sdk.Query.equal("userId", user.userId),
          ]);

          if (response.total > 0) {
            const doc = response.documents[0];
            setDocumentId(doc.$id);

            // Fetch and set the current file names if they exist
            if (doc.profileImg) {
              const profileImageFile = await storage.images.getFile(doc.profileImg);
              setProfileImage({ name: profileImageFile.name, id: doc.profileImg });
            }
            if (doc.cv) {
              const cvFile = await storage.files.getFile(doc.cv);
              setCvFile({ name: cvFile.name, id: doc.cv });
            }
            if (doc.video) {
              const videoFile = await storage.videos.getFile(doc.video);
              setVideoFile({ name: videoFile.name, id: doc.video });
            }
          } else {
            const newDocument = await db.jobSeekers.create({
              userId: user.userId,
            });
            setDocumentId(newDocument.$id);
          }
        }
        console.log("user: ", user);
      } catch (error) {
        console.error("Error initializing services:", error);
      }
    };

    initializeServices();
  }, [user]);

  // Handlers for file selection
  const handleProfileImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleCvFileChange = (e) => {
    setCvFile(e.target.files[0]);
  };

  const handleVideoFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  // Handle file uploads
  const handleUpload = async (e) => {
    e.preventDefault();

    if (!storageServices || !dbServices || !documentId) {
      console.error("Services not initialized properly");
      return;
    }

    try {
      const updates = {};

      // Upload Profile Image
      if (profileImage && !profileImage.id) {
        const profileImageUpload = await storageServices.images.createFile(
          profileImage
        );
        updates.profileImg = profileImageUpload.$id;
        console.log("Profile image uploaded successfully.");
      }

      // Upload CV File
      if (cvFile && !cvFile.id) {
        const cvFileUpload = await storageServices.files.createFile(cvFile);
        updates.cv = cvFileUpload.$id;
        console.log("CV uploaded successfully.");
      }

      // Upload Video File
      if (videoFile && !videoFile.id) {
        const videoFileUpload = await storageServices.videos.createFile(
          videoFile
        );
        updates.video = videoFileUpload.$id;
        console.log("Video uploaded successfully.");
      }

      // Update jobSeekers document
      if (Object.keys(updates).length > 0) {
        await dbServices.jobSeekers.update(documentId, updates);
        console.log("jobSeekers document updated successfully.");
      }

      alert("Files uploaded and data updated successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred during upload. Please try again.");
    }
  };

  return (
    <form onSubmit={handleUpload} className="default-form">
      {/* Profile Image Upload */}
      <div className="uploading-outer">
        <div className="uploadButton mr-6">
          <input
            className="uploadButton-input"
            type="file"
            accept="image/*"
            id="uploadProfileImage"
            onChange={handleProfileImageChange}
          />
          <label
            className={`uploadButton-button ripple-effect ${profileImage ? "uploadButton-green" : ""}`}
            htmlFor="uploadProfileImage"
          >
            {profileImage ? profileImage.name : "Upload Profile Image"}
          </label>
        </div>
        <div className="text">
          Max file size: 50MB. Allowed types: jpg, jpeg, png, gif.
        </div>
      </div>

      {/* CV Upload */}
      <div className="uploading-outer">
        <div className="uploadButton mr-6">
          <input
            className="uploadButton-input"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            id="uploadCvFile"
            onChange={handleCvFileChange}
          />
          <label
            className={`uploadButton-button ripple-effect ${cvFile ? "uploadButton-green" : ""}`}
            htmlFor="uploadCvFile"
          >
            {cvFile ? cvFile.name : "Upload CV"}
          </label>
        </div>
        <div className="text">
          Max file size: 50MB. Allowed types: pdf, doc, docx, txt.
        </div>
      </div>

      {/* Video Upload */}
      <div className="uploading-outer">
        <div className="uploadButton mr-6">
          <input
            className="uploadButton-input"
            type="file"
            accept="video/*"
            id="uploadVideoFile"
            onChange={handleVideoFileChange}
          />
          <label
            className={`uploadButton-button ripple-effect ${videoFile ? "uploadButton-green" : ""}`}
            htmlFor="uploadVideoFile"
          >
            {videoFile ? videoFile.name : "Upload Video"}
          </label>
        </div>
        <div className="text">
          Max file size: 50MB. Allowed types: mp4, mov, avi.
        </div>
      </div>

      <div className="form-group col-lg-12 col-md-12 mb-12">
        <button
          className="theme-btn btn-style-one"
          type="submit"
          disabled={!profileImage && !cvFile && !videoFile}
        >
          {profileImage || cvFile || videoFile ? "Upload Files" : "No Files to Upload"}
        </button>
      </div>
    </form>
  );
};

export default LogoUpload;
