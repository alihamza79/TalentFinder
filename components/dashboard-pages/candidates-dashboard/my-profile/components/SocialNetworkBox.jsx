'use client';

import { useState, useEffect } from "react";
import * as sdk from "node-appwrite";
import useAuth from "@/app/hooks/useAuth";  // Use the Auth hook to get userId
import initializeDB from "@/appwrite/Services/dbServices";

const SocialNetworkBox = () => {
    const [db, setDb] = useState(null);
    const [documentId, setDocumentId] = useState(null);  // To track if a document already exists
    const [formData, setFormData] = useState({
        linkedin: "",
        github: "",
        twitter: "",
    });

    const { user } = useAuth();  // Access the logged-in userId from global auth context

    // Fetch the document from Appwrite based on userId and populate the form
    useEffect(() => {
      const fetchData = async () => {
          const initializedDb = await initializeDB();  // Await the database initialization
          setDb(initializedDb);  // Set the db state
          
          console.log("Database initialized:", initializedDb); // Debug log
  
          if (user?.userId && initializedDb) {
              initializedDb.jobSeekers?.list([sdk.Query.equal('userId', user.userId)])
                  .then((response) => {
                      if (response.documents.length > 0) {
                          const document = response.documents[0];
                          setDocumentId(document.$id);  // Set the document ID
  
                          setFormData({
                              linkedin: document.linkedin || "",
                              github: document.github || "",
                              twitter: document.twitter || "",
                          });
                      } else {
                          console.error("No document found for this user.");
                      }
                  })
                  .catch((error) => {
                      console.error("Error fetching document:", error);
                  });
          }
      };
  
      fetchData();
  }, [user]);
  

    // Handle input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission (save data to Appwrite)
    const handleSave = async (e) => {
      e.preventDefault();
  
      console.log("Save button clicked!");
  
      const updatedData = {
          linkedin: formData.linkedin,
          github: formData.github,
          twitter: formData.twitter,
          userId: user.userId
      };
  
      console.log("Updated Data:", updatedData);
      console.log("Document ID:", documentId);
      console.log("DB object:", db);
  
      try {
          if (documentId && db.jobSeekers) {
              // Update existing document
              const response = await db.jobSeekers.update(documentId, updatedData);
              console.log("Document updated successfully:", response);
          } else if (db.jobSeekers) {
              // Create a new document
              const newDoc = await db.jobSeekers.create(updatedData);
              setDocumentId(newDoc.$id);
              console.log("Document created successfully:", newDoc);
          } else {
              console.error("jobSeekers collection not found in db");
          }
      } catch (error) {
          console.error("Error during save operation:", error);
      }
  };
  
  

    return (
        <form className="default-form" onSubmit={handleSave}>
            <div className="row">
                {/* LinkedIn Input */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>LinkedIn</label>
                    <input
                        type="text"
                        name="linkedin"
                        placeholder="LinkedIn Profile URL"
                        value={formData.linkedin}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                {/* Twitter Input */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Twitter</label>
                    <input
                        type="text"
                        name="twitter"
                        placeholder="Twitter Profile URL"
                        value={formData.twitter}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                {/* GitHub Input */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>GitHub</label>
                    <input
                        type="text"
                        name="github"
                        placeholder="GitHub Profile URL"
                        value={formData.github}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                {/* Save Button */}
                <div className="form-group col-lg-12 col-md-12">
                    <button className="theme-btn btn-style-one" type="submit">
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SocialNetworkBox;
