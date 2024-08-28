'use client';

import { useState, useEffect } from "react";
import Select from "react-select";
import * as sdk from "node-appwrite";
import useAuth from "@/app/hooks/useAuth";  // Use the Auth hook to get userId
import initializeDB from "@/appwrite/Services/dbServices";

const FormInfoBox = () => {
    const [db, setDb] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [subCategories, setSubCategories] = useState([]);

    const catOptions = [
        {
            label: "Metal Technology",
            value: "Metal Technology",
            subOptions: [
                { value: "Plant mechanic", label: "Plant mechanic" },
                { value: "CNC specialist", label: "CNC specialist" },
                { value: "Specialist for metal technology", label: "Specialist for metal technology" },
                { value: "Precision mechanic", label: "Precision mechanic" },
                { value: "Foundry mechanic", label: "Foundry mechanic" },
                { value: "Industrial mechanic", label: "Industrial mechanic" },
                { value: "Engineer - Automotive engineering", label: "Engineer - Automotive engineering" },
                { value: "Engineer - mechanical engineering", label: "Engineer - mechanical engineering" },
                { value: "Automotive mechatronics technician", label: "Automotive mechatronics technician" },
                { value: "Construction mechanic", label: "Construction mechanic" },
                { value: "Machine and plant operator", label: "Machine and plant operator" },
                { value: "Machine technology technician", label: "Machine technology technician" },
                { value: "Tool mechanic", label: "Tool mechanic" },
                { value: "Machining mechanic", label: "Machining mechanic" }
            ]
        },
        {
            label: "Welding Technology",
            value: "Welding Technology",
            subOptions: [
                { value: "Manual electric welder", label: "Manual electric welder" },
                { value: "Gas welder", label: "Gas welder" },
                { value: "High-pressure welder", label: "High-pressure welder" },
                { value: "MAG welder", label: "MAG welder" },
                { value: "MIG welder", label: "MIG welder" },
                { value: "Welding specialist", label: "Welding specialist" },
                { value: "Welding foreman", label: "Welding foreman" },
                { value: "TIG welder", label: "TIG welder" }
            ]
        },
        {
            label: "Electrical Engineering",
            value: "Electrical Engineering",
            subOptions: [
                { value: "Bachelor of Engineering Electrical Engineering", label: "Bachelor of Engineering Electrical Engineering" },
                { value: "Bachelor of Science Electrical Engineering", label: "Bachelor of Science Electrical Engineering" },
                { value: "Electrical systems fitter", label: "Electrical systems fitter" },
                { value: "Electronics technician - automation and systems engineering", label: "Electronics technician - automation and systems engineering" },
                { value: "Electronics technician - automation technology", label: "Electronics technician - automation technology" },
                { value: "Electronics technician - industrial engineering", label: "Electronics technician - industrial engineering" },
                { value: "Electronics technician - energy and building technology", label: "Electronics technician - energy and building technology" },
                { value: "Electronics technician - building and infrastructure systems", label: "Electronics technician - building and infrastructure systems" },
                { value: "Electronics technician - building systems integration", label: "Electronics technician - building systems integration" },
                { value: "Electronics technician - devices and systems", label: "Electronics technician - devices and systems" },
                { value: "Electronics technician - information and systems technology", label: "Electronics technician - information and systems technology" },
                { value: "Electronics technician - machines and drive technology (BBiG)", label: "Electronics technician - machines and drive technology (BBiG)" },
                { value: "Electronics technician - machines and drive technology (HwO)", label: "Electronics technician - machines and drive technology (HwO)" },
                { value: "Industrial electrician - operating technology", label: "Industrial electrician - operating technology" },
                { value: "Industrial electrician - devices and systems", label: "Industrial electrician - devices and systems" },
                { value: "Master of Electrical Engineering", label: "Master of Electrical Engineering" },
                { value: "Electrical engineering technician", label: "Electrical engineering technician" }
            ]
        },
        {
            label: "Mechatronics",
            value: "Mechatronics",
            subOptions: [
                { value: "Engineer - Mechatronics", label: "Engineer - Mechatronics" },
                { value: "Mechatronics engineer", label: "Mechatronics engineer" }
            ]
        },
        { label: "Chemistry", value: "Chemistry", subOptions: [] },
        {
            label: "IT/EDP",
            value: "IT/EDP",
            subOptions: [
                { value: "IT specialist for system integration", label: "IT specialist for system integration" },
                { value: "Computer scientist", label: "Computer scientist" },
                { value: "Engineer - Information and communication technology", label: "Engineer - Information and communication technology" },
                { value: "IT administrator", label: "IT administrator" },
                { value: "Media computer scientist", label: "Media computer scientist" },
                { value: "Computer science technician", label: "Computer science technician" }
            ]
        },
        {
            label: "Software Development",
            value: "Software Development",
            subOptions: [
                { value: "Backend Developer", label: "Backend Developer" },
                { value: "Database developer", label: "Database developer" },
                { value: "IT specialist for application development", label: "IT specialist for application development" },
                { value: "Frontend developer", label: "Frontend developer" },
                { value: "Full-Stack Developer", label: "Full-Stack Developer" }
            ]
        },
        { label: "Warehouse Logistics", value: "Warehouse Logistics", subOptions: [] }
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
        const fetchData = async () => {
            const initializedDb = await initializeDB();  // Await the database initialization
            setDb(initializedDb);  // Set the db state
            
            if (user?.userId && initializedDb) {
                initializedDb.company?.list([sdk.Query.equal('userId', user.userId)])
                    .then((response) => {
                        if (response.documents.length > 0) {
                            const document = response.documents[0];
                            setDocumentId(document.$id);  // Set the document ID

                            // Match the fetched categories with the options in catOptions
                            const selectedCategories = [];
                            const selectedSubCategories = [];

                            document.categoryTags?.forEach(tag => {
                                const mainCategory = catOptions.find(category => category.subOptions.find(sub => sub.value === tag));
                                if (mainCategory) {
                                    selectedCategories.push({ value: mainCategory.value, label: mainCategory.label });
                                    const subCategory = mainCategory.subOptions.find(sub => sub.value === tag);
                                    if (subCategory) {
                                        selectedSubCategories.push({ value: subCategory.value, label: subCategory.label });
                                    }
                                }
                            });

                            setSelectedCategory(selectedCategories[0]);
                            setSubCategories(selectedCategories[0]?.subOptions || []);

                            setFormData({
                                companyName: document.name || "",
                                email: document.email || "",
                                phone: document.phone || "",
                                website: document.website || "",
                                estSince: document.since || "",
                                teamSize: document.companySize || "",
                                category: selectedSubCategories || [],
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

    // Handle category selection
    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setSubCategories(selectedOption.subOptions || []);
    };

    // Handle subcategory selection
    const handleSubCategoryChange = (selectedSubCategories) => {
        setFormData((prevData) => ({
            ...prevData,
            category: [...formData.category, ...selectedSubCategories]
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

        if (documentId && db) {
            // Update existing document
            db.company?.update(documentId, updatedData)
                .then(() => {
                    console.log("Document updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating document:", error);
                });
        } else if (db) {
            // Create a new document
            db.company?.create(updatedData)
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

                {/* Category Select */}
                <div className="form-group col-lg-6 col-md-12">
                    <label>Category</label>
                    <Select
                        value={selectedCategory}
                        name="category"
                        options={catOptions}
                        className="basic-single-select"
                        classNamePrefix="select"
                        onChange={handleCategoryChange}
                        placeholder="Select Category"
                    />
                </div>

                {/* Subcategory Select (shows only if a category is selected) */}
                {subCategories.length > 0 && (
                    <div className="form-group col-lg-6 col-md-12">
                        <label>Subcategories</label>
                        <Select
                            value={formData.category}
                            isMulti
                            name="subcategory"
                            options={subCategories}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            onChange={handleSubCategoryChange}
                            placeholder="Select Subcategory"
                        />
                    </div>
                )}

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
