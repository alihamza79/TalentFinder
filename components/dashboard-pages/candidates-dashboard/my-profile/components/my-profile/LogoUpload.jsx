'use client'


// Import the storage service
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

  const [uploading, setUploading] = useState(false);

  const { user } = useAuth(); // Get current user

  // Initialize storage and database services
  useEffect(() => {
    const initializeServices = async () => {
      try {
        const storage = await initializeStorageServices();
        setStorageServices(storage);

        const db = await initializeDB();
        setDbServices(db);

        // Fetch or create jobSeeker document of the current user(by there userID)
        if (user && db.jobSeekers) {
          const response = await db.jobSeekers.list([
            sdk.Query.equal("userId", user.userId),
          ]);

          if (response.total > 0) {
            setDocumentId(response.documents[0].$id);
          } else {
            const newDocument = await db.jobSeekers.create({
              userId: user.userId,
            });
            setDocumentId(newDocument.$id);
          }
        }
        console.log("user: ",user);
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

    if (!storageServices) {
        console.error("Services not initialized properly: storageServices");
        return;
      }

      if (!dbServices) {
        console.error("Services not initialized properly: dbServices");
        return;
      }

      if (!documentId) {
        console.error("Services not initialized properly: documentId");
        return;
      }

    setUploading(true);

    try {
      const updates = {};

      // Upload Profile Image
      if (profileImage) {
        const profileImageUpload = await storageServices.images.createFile(
          profileImage
        );
        updates.profileImg = profileImageUpload.$id;
        console.log("Profile image uploaded successfully.");
      }

      // Upload CV File
      if (cvFile) {
        const cvFileUpload = await storageServices.files.createFile(cvFile);
        updates.cv = cvFileUpload.$id;
        console.log("CV uploaded successfully.");
      }

      // Upload Video File
      if (videoFile) {
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

      // Reset file inputs
      setProfileImage(null);
      setCvFile(null);
      setVideoFile(null);
      alert("Files uploaded and data updated successfully!");
    } catch (error) {
      console.error("Error uploading files:", error);
      alert("An error occurred during upload. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleUpload}>
      {/* Profile Image Upload */}
      <div className="uploading-outer">
        <div className="uploadButton">
          <input
            className="uploadButton-input"
            type="file"
            accept="image/*"
            id="uploadProfileImage"
            onChange={handleProfileImageChange}
          />
          <label
            className="uploadButton-button ripple-effect"
            htmlFor="uploadProfileImage"
          >
            {profileImage ? profileImage.name : "Upload Profile Image"}
          </label>
        </div>
        <div className="text">
          Max file size: 2MB. Allowed types: jpg, jpeg, png, gif.
        </div>
      </div>

      {/* CV Upload */}
      <div className="uploading-outer">
        <div className="uploadButton">
          <input
            className="uploadButton-input"
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            id="uploadCvFile"
            onChange={handleCvFileChange}
          />
          <label
            className="uploadButton-button ripple-effect"
            htmlFor="uploadCvFile"
          >
            {cvFile ? cvFile.name : "Upload CV"}
          </label>
        </div>
        <div className="text">
          Max file size: 5MB. Allowed types: pdf, doc, docx, txt.
        </div>
      </div>

      {/* Video Upload */}
      <div className="uploading-outer">
        <div className="uploadButton">
          <input
            className="uploadButton-input"
            type="file"
            accept="video/*"
            id="uploadVideoFile"
            onChange={handleVideoFileChange}
          />
          <label
            className="uploadButton-button ripple-effect"
            htmlFor="uploadVideoFile"
          >
            {videoFile ? videoFile.name : "Upload Video"}
          </label>
        </div>
        <div className="text">
          Max file size: 20MB. Allowed types: mp4, mov, avi.
        </div>
      </div>

      <button
        className="button ripple-effect"
        type="submit"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload Files"}
      </button>
    </form>
  );
};

export default LogoUpload;
