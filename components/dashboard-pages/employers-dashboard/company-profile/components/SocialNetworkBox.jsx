'use client';

import { useState, useEffect } from "react";
import * as sdk from "node-appwrite";
import useAuth from "@/app/hooks/useAuth";  // Use the Auth hook to get userId
import initializeDB from "@/appwrite/Services/dbServices";

const SocialNetworkBox = () => {
    const { user } = useAuth();  // Access the logged-in userId from global auth context
    const [db, setDb] = useState(null);
    const [documentId, setDocumentId] = useState(null);  // Track document ID
    const [socialInfo, setSocialInfo] = useState({
        facebook: '',
        twitter: '',
        linkedin: '',
        googlePlus: ''
    });

    // Fetch the document from Appwrite based on userId and populate the form
    useEffect(() => {
        const fetchData = async () => {
            const initializedDb = await initializeDB();  // Await the database initialization
            setDb(initializedDb);  // Set the db state
            
            if (user?.userId && initializedDb) {
                initializedDb.company?.list([sdk.Query.equal('userId', user.userId)])
                    .then((response) => {
                        if (response.documents.length > 0) {
                            const document = response.documents[0];
                            setDocumentId(document.$id);
                            setSocialInfo({
                                facebook: document.socials?.[0] || '',
                                twitter: document.socials?.[1] || '',
                                linkedin: document.socials?.[2] || '',
                                googlePlus: document.socials?.[3] || '',
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

    // Update state on form field change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSocialInfo((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission (save data directly to Appwrite)
    const handleSave = (e) => {
        e.preventDefault();

        const updatedData = {
            socials: [
                socialInfo.facebook,
                socialInfo.twitter,
                socialInfo.linkedin,
                socialInfo.googlePlus
            ],
            userId: user.userId  // Ensure userId is included in the document
        };

        if (documentId && db) {
            // Update existing document
            db.company?.update(documentId, updatedData)
                .then(() => {
                    console.log("Social information updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating social information:", error);
                });
        } else if (db) {
            // Create a new document
            db.company?.create(updatedData)
                .then((newDoc) => {
                    setDocumentId(newDoc.$id);
                    console.log("Social information created successfully");
                })
                .catch((error) => {
                    console.error("Error creating social information:", error);
                });
        }
    };

    return (
        <form className="default-form" onSubmit={handleSave}>
            <div className="row">
                <div className="form-group col-lg-6 col-md-12">
                    <label>Facebook</label>
                    <input
                        type="text"
                        name="facebook"
                        placeholder="www.facebook.com/Invision"
                        value={socialInfo.facebook}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Twitter</label>
                    <input
                        type="text"
                        name="twitter"
                        placeholder=""
                        value={socialInfo.twitter}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Linkedin</label>
                    <input
                        type="text"
                        name="linkedin"
                        placeholder=""
                        value={socialInfo.linkedin}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Google Plus</label>
                    <input
                        type="text"
                        name="googlePlus"
                        placeholder=""
                        value={socialInfo.googlePlus}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <button type="submit" className="theme-btn btn-style-one">
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
};

export default SocialNetworkBox;
