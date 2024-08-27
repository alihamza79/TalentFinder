'use client';

import { useState, useEffect } from "react";
import Select from "react-select";
import db from "@/appwrite/Services/dbServices";
import * as sdk from "node-appwrite";
import useAuth from "@/app/hooks/useAuth";  // Use the Auth hook to get userId

const FormInfoBox = () => {
    const catOptions = [
        { value: "Banking", label: "Banking" },
        { value: "Digital & Creative", label: "Digital & Creative" },
        { value: "Retail", label: "Retail" },
        { value: "Human Resources", label: "Human Resources" },
        { value: "Management", label: "Management" },
        { value: "Accounting & Finance", label: "Accounting & Finance" },
        { value: "Digital", label: "Digital" },
        { value: "Creative Art", label: "Creative Art" },
    ];

    const { user } = useAuth();  // Access the logged-in userId from global auth context
    const [documentId, setDocumentId] = useState(null);  // To track if a document already exists
    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        phone: "",
        website: "",
        estSince: "",
        teamSize: "",
        category: [],  // Default selected category
        allowListing: "Yes",
        aboutCompany: "",
    });

    // Fetch the document from Appwrite based on userId and populate the form
    useEffect(() => {
        if (user?.userId) {
            db.company.list([sdk.Query.equal('userId', user.userId)])
                .then((response) => {
                    if (response.documents.length > 0) {
                        const document = response.documents[0];
                        setDocumentId(document.$id);  // Set the document ID
                        setFormData({
                            companyName: document.name || "",
                            email: document.email || "",
                            phone: document.phone || "",
                            website: document.website || "",
                            estSince: document.since || "",
                            teamSize: document.companySize || "",
                            category: document.categoryTags?.map(tag => ({ value: tag, label: tag })) || [],
                            allowListing: document.allowListingVisibility || "Yes",
                            aboutCompany: document.aboutCompany || "",
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
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Update category select
    const handleCategoryChange = (selectedOptions) => {
        setFormData((prevData) => ({
            ...prevData,
            category: selectedOptions,
        }));
    };

    // Handle form submission (save data to Appwrite)
    const handleSave = (e) => {
        e.preventDefault();

        const updatedData = {
            name: formData.companyName,
            email: formData.email,
            phone: formData.phone,
            website: formData.website,
            since: formData.estSince,
            companySize: formData.teamSize,
            allowListingVisibility: formData.allowListing,
            aboutCompany: formData.aboutCompany,
            categoryTags: formData.category.map(cat => cat.value),
            userId: user.userId  // Ensure userId is included in the document
        };

        if (documentId) {
            // Update existing document
            db.company.update(documentId, updatedData)
                .then(() => {
                    console.log("Document updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating document:", error);
                });
        } else {
            // Create a new document
            db.company.create(updatedData)
                .then((newDoc) => {
                    setDocumentId(newDoc.$id);
                    console.log("Document created successfully");
                })
                .catch((error) => {
                    console.error("Error creating document:", error);
                });
        }
    };

    return (
        <form className="default-form" onSubmit={handleSave}>
            <div className="row">
                {/* Company Name Input */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Company name</label>
                    <input
                        type="text"
                        name="companyName"
                        placeholder="Invisionn"
                        value={formData.companyName}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                {/* Email Address Input */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Email address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="ib-themes"
                        value={formData.email}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                {/* Phone Input */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="0 123 456 7890"
                        value={formData.phone}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                {/* Website Input */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Website</label>
                    <input
                        type="text"
                        name="website"
                        placeholder="www.invision.com"
                        value={formData.website}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                {/* Est. Since Input */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Est. Since</label>
                    <input
                        type="text"
                        name="estSince"
                        placeholder="06.04.2020"
                        value={formData.estSince}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                {/* Team Size Input */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Team Size</label>
                    <select
                        name="teamSize"
                        className="chosen-single form-select"
                        value={formData.teamSize}
                        required
                        onChange={handleInputChange}
                    >
                        <option value="50 - 100">50 - 100</option>
                        <option value="100 - 150">100 - 150</option>
                        <option value="200 - 250">200 - 250</option>
                        <option value="300 - 350">300 - 350</option>
                        <option value="500 - 1000">500 - 1000</option>
                    </select>
                </div>

                {/* Multiple Category Select */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Multiple Select boxes</label>
                    <Select
                        value={formData.category}
                        isMulti
                        name="category"
                        options={catOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleCategoryChange}
                    />
                </div>

                {/* Allow In Search & Listing Input */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Allow In Search & Listing</label>
                    <select
                        name="allowListing"
                        className="chosen-single form-select"
                        value={formData.allowListing}
                        onChange={handleInputChange}
                    >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>

                {/* About Company Textarea */}
                <div className="form-group col-lg-12 col-md-12">
                    <label>About Company</label>
                    <textarea
                        name="aboutCompany"
                        placeholder="Description about the company"
                        value={formData.aboutCompany}
                        onChange={handleInputChange}
                    ></textarea>
                </div>

                {/* Save Button */}
                <div className="form-group col-lg-6 col-md-12">
                    <button className="theme-btn btn-style-one" type="submit">
                        Save
                    </button>
                </div>
            </div>
        </form>
    );
};

export default FormInfoBox;
