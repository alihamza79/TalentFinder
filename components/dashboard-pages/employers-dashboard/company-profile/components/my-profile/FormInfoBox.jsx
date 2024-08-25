'use client'

import { useState } from "react";
import Select from "react-select";
import { useFormData } from "@/context/FormDataContext";  // Import the context hook

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

    const { updateFormData } = useFormData();  // Hook for updating global state
    const [formData, setFormData] = useState({
        companyName: "",
        email: "",
        phone: "",
        website: "",
        estSince: "",
        teamSize: "",
        category: [catOptions[2]],  // Default selected category
        allowListing: "Yes",
        aboutCompany: "",
    });

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

    // Handle form submission (save data to global state)
    const handleSave = (e) => {
        e.preventDefault();
        // console.log("Form Data Saved:", formData);
        updateFormData('companyInfo', formData);  // Save the form data in the global state
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
