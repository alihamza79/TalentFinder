'use client'

import { useState, useEffect } from "react";
import { useFormData } from "@/context/FormDataContext";

const LogoCoverUploader = () => {
    const [logoImg, setLogoImg] = useState("");
    const [coverImg, setCoverImg] = useState("");
    const { updateFormData } = useFormData();

    useEffect(() => {
        updateFormData('companyInfo', { logoImg, coverImg });
    }, [logoImg, coverImg]);

    const logoHandler = (file) => {
        setLogoImg(file);
    };

    const coverHandler = (file) => {
        setCoverImg(file);
    };

    return (
        <>
            <div className="uploading-outer">
                <div className="uploadButton">
                    <input
                        className="uploadButton-input"
                        type="file"
                        name="attachments[]"
                        accept="image/*"
                        id="upload"
                        required
                        onChange={(e) => logoHandler(e.target.files[0])}
                    />
                    <label
                        className="uploadButton-button ripple-effect"
                        htmlFor="upload"
                    >
                        {logoImg !== "" ? logoImg?.name : " Browse Logo"}
                    </label>
                </div>
                <div className="text">
                    Max file size is 1MB, Minimum dimension: 330x300 And Suitable files are .jpg & .png
                </div>
            </div>

            <div className="uploading-outer">
                <div className="uploadButton">
                    <input
                        className="uploadButton-input"
                        type="file"
                        name="attachments[]"
                        accept="image/*, application/pdf"
                        id="upload_cover"
                        onChange={(e) => coverHandler(e.target.files[0])}
                    />
                    <label
                        className="uploadButton-button ripple-effect"
                        htmlFor="upload_cover"
                    >
                        {coverImg !== "" ? coverImg?.name : "Browse Cover"}
                    </label>
                </div>
                <div className="text">
                    Max file size is 1MB, Minimum dimension: 330x300 And Suitable files are .jpg & .png
                </div>
            </div>
        </>
    );
};

export default LogoCoverUploader;
