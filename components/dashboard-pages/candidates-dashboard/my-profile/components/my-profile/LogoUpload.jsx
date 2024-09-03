'use client'

import { useState, useEffect } from "react";
import { initializeStorageServices } from "@/appwrite/Services/storageServices"; 
import initializeDB from "@/appwrite/Services/dbServices";
import useAuth from "@/app/hooks/useAuth";
import * as sdk from "node-appwrite";
import { ID } from "node-appwrite"; // Importing ID from node-appwrite
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

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
        toast.error("Failed to initialize services.");
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
    setUploading(true);
    const toastId = toast.info('Uploading...', { autoClose: false });

    if (!storageServices || !dbServices || !documentId) {
      console.error("Services not initialized properly");
      toast.update(toastId, { render: "Services not initialized properly. Please try again.", type: toast.TYPE.ERROR, autoClose: 5000 });
      setUploading(false);
      return;
    }

    try {
      const updates = {};

      const uploadFile = async (file, service, type) => {
        if (file && !file.id) {
          const uploadProgress = 0; // Replace this with actual progress tracking if available
          toast.update(toastId, { render: `Uploading ${type}... ${uploadProgress}%`, type: toast.TYPE.INFO });

          const uploadedFile = await service.createFile(file, ID.unique());

          toast.update(toastId, { render: `${type} uploaded successfully.`, type: toast.TYPE.SUCCESS, autoClose: 5000 });
          return uploadedFile.$id;
        }
        return null;
      };

      // Upload Profile Image
      const profileImgId = await uploadFile(profileImage, storageServices.images, "Profile Image");
      if (profileImgId) updates.profileImg = profileImgId;

      // Upload CV File
      const cvId = await uploadFile(cvFile, storageServices.files, "CV");
      if (cvId) updates.cv = cvId;

      // Upload Video File
      const videoId = await uploadFile(videoFile, storageServices.videos, "Video");
      if (videoId) updates.video = videoId;

      // Update jobSeekers document
      if (Object.keys(updates).length > 0) {
        await dbServices.jobSeekers.update(documentId, updates);
        console.log("jobSeekers document updated successfully.");
        toast.update(toastId, { render: "Files uploaded and data updated successfully!", type: toast.TYPE.SUCCESS, autoClose: 5000 });
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      toast.update(toastId, { render: `An error occurred during upload: ${error}.`, type: toast.TYPE.ERROR, autoClose: 5000 });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
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
              className={`uploadButton-button ripple-effect ${profileImage && profileImage.name ? "uploadButton-green" : ""}`}
              htmlFor="uploadProfileImage"
            >
              <div className={`${profileImage && profileImage.name ? "text-green-500" : ""}`}>
                {profileImage && profileImage.name ? profileImage.name : "Upload Profile Image"}
              </div>
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
              className={`uploadButton-button ripple-effect ${cvFile && cvFile.name ? "uploadButton-green" : ""}`}
              htmlFor="uploadCvFile"
            >
              <div className={`${cvFile && cvFile.name ? "text-green-500" : ""}`}>
                {cvFile && cvFile.name ? cvFile.name : "Upload CV"}
              </div>
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
              className="uploadButton-input "
              type="file"
              accept="video/*"
              id="uploadVideoFile"
              onChange={handleVideoFileChange}
            />
            <label
              className={`uploadButton-button ripple-effect ${videoFile && videoFile.name ? "uploadButton-green" : ""}`}
              htmlFor="uploadVideoFile"
            >
              <div className={`${videoFile && videoFile.name ? "text-green-500" : ""}`}>
                {videoFile && videoFile.name ? videoFile.name : "Upload Video"}
              </div>
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
            disabled={uploading || (!profileImage && !cvFile && !videoFile)}
          >
            {uploading ? "Uploading..." : "Upload Files"}
          </button>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default LogoUpload;
