'use client';

import { useState, useEffect } from "react";
import db from "@/appwrite/Services/dbServices";
import * as sdk from "node-appwrite";
import useAuth from "@/app/hooks/useAuth";  // Use the Auth hook to get userId

const ContactInfoBox = () => {
    const { user } = useAuth();  // Access the logged-in userId from global auth context
    const [documentId, setDocumentId] = useState(null);  // Track document ID
    const [contactInfo, setContactInfo] = useState({
        country: '',
        city: '',
        address: ''
    });

    // Fetch the document from Appwrite based on userId and populate the form
    useEffect(() => {
        if (user?.userId) {
            db.company.list([sdk.Query.equal('userId', user.userId)])
                .then((response) => {
                    if (response.documents.length > 0) {
                        const document = response.documents[0];
                        setDocumentId(document.$id);
                        setContactInfo({
                            country: document.country || '',
                            city: document.city || '',
                            address: document.address || '',
                        });
                    } else {
                        console.error("No document found for this user.");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching document:", error);
                });
        }
    }, [user]);

    // Update state on form field change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactInfo((prev) => ({ ...prev, [name]: value }));
    };

    // Handle form submission (save data directly to Appwrite)
    const handleSave = (e) => {
        e.preventDefault();

        const updatedData = {
            country: contactInfo.country,
            city: contactInfo.city,
            address: contactInfo.address,
            userId: user.userId  // Ensure userId is included in the document
        };

        if (documentId) {
            // Update existing document
            db.company.update(documentId, updatedData)
                .then(() => {
                    console.log("Contact information updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating contact information:", error);
                });
        } 
    };

    return (
        <form className="default-form" onSubmit={handleSave}>
            <div className="row">
                <div className="form-group col-lg-6 col-md-12">
                    <label>Country</label>
                    <input
                        type="text"
                        name="country"
                        placeholder="United States"
                        value={contactInfo.country}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        placeholder="California"
                        value={contactInfo.city}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-12 col-md-12">
                    <label>Complete Address</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
                        value={contactInfo.address}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-12 col-md-12">
                    <button type="submit" className="theme-btn btn-style-one">
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
};

export default ContactInfoBox;
