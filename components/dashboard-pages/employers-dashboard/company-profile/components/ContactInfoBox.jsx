'use client'

import { useState } from "react";
import { useFormData } from "@/context/FormDataContext";

const ContactInfoBox = () => {
    const { updateFormData } = useFormData();
    const [contactInfo, setContactInfo] = useState({
        country: '',
        city: '',
        address: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContactInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateFormData('contactInfo', contactInfo);
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
