'use client'

import { useState } from "react";
import { useFormData } from "@/context/FormDataContext";

const SocialNetworkBox = () => {
    const { updateFormData } = useFormData();
    const [socialInfo, setSocialInfo] = useState({
        facebook: '',
        twitter: '',
        linkedin: '',
        googlePlus: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSocialInfo((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = (e) => {
        e.preventDefault();
        updateFormData('socialInfo', socialInfo);
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
