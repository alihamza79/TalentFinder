'use client';

import { useState, useEffect } from "react";
import Select from "react-select";
import * as sdk from "node-appwrite";
import useAuth from "@/app/hooks/useAuth";  
import initializeDB from "@/appwrite/Services/dbServices";
import catOptions from "@/data/categories"; 

const FormInfoBox = () => {
    const [db, setDb] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [skillsOptions, setSkillsOptions] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        jobTitle: "",
        country: "",
        city: "",
        expectedSalaryRange: "", 
        categoryTags: [], 
        experience: 0,  
        age: 0,
        gender: "",
        languages: "",
        educationalLevel: "",
        skills: [],
        description: "",
    });

    const { user } = useAuth();  
    const [documentId, setDocumentId] = useState(null);  

    useEffect(() => {
        const fetchData = async () => {
            const initializedDb = await initializeDB();  
            setDb(initializedDb);  
            
            if (user?.userId && initializedDb) {
                initializedDb.jobSeekers?.list([sdk.Query.equal('userId', user.userId)])
                    .then((response) => {
                        if (response.documents.length > 0) {
                            const document = response.documents[0];
                            setDocumentId(document.$id);  

                            const selectedCategories = [];
                            const selectedSkills = [];

                            document.categoryTags?.forEach(tag => {
                                const mainCategory = catOptions.find(category => category.value === tag);
                                if (mainCategory) {
                                    selectedCategories.push({ value: mainCategory.value, label: mainCategory.label });
                                }
                            });

                            document.skills?.forEach(skill => {
                                const skillOption = catOptions.find(option => option.value === skill);
                                if (skillOption) {
                                    selectedSkills.push({ value: skillOption.value, label: skillOption.label });
                                }
                            });

                            setSelectedCategory(selectedCategories);
                            setSkillsOptions(selectedSkills);

                            setFormData({
                                name: document.name || "",
                                jobTitle: document.jobTitle || "",
                                country: document.country || "",
                                city: document.city || "",
                                expectedSalaryRange: document.expectedSalaryRange || "",  
                                categoryTags: selectedCategories || [],
                                experience: document.experience || 0,  
                                age: document.age || 0,
                                gender: document.gender || "",
                                languages: document.languages || "",
                                educationalLevel: document.educationalLevel || "",
                                skills: selectedSkills || [],
                                description: document.description || "",
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: name === "experience" || name === "age" 
                ? isNaN(parseInt(value, 10)) ? 0 : parseInt(value, 10) 
                : value,
        }));
    };

    const handleCategoryChange = (selectedOption) => {
        setSelectedCategory(selectedOption);
        setFormData((prevData) => ({
            ...prevData,
            categoryTags: selectedOption ? selectedOption.map(cat => cat.value) : [],
        }));
    };

    const handleSkillsChange = (selectedSkills) => {
        setSkillsOptions(selectedSkills);
        setFormData((prevData) => ({
            ...prevData,
            skills: selectedSkills ? selectedSkills.map(skill => skill.value) : [],
        }));
    };

    const handleSave = (e) => {
        e.preventDefault();

        const updatedData = {
            name: formData.name,
            jobTitle: formData.jobTitle,
            country: formData.country,
            city: formData.city,
            expectedSalaryRange: formData.expectedSalaryRange,
            categoryTags: formData.categoryTags.map(cat => cat.value),  // Ensure strings only
            experience: formData.experience,
            age: formData.age,
            gender: formData.gender,
            languages: formData.languages,
            educationalLevel: formData.educationalLevel,
            skills: formData.skills.map(skill => skill.value),  // Ensure strings only
            description: formData.description,
            userId: user.userId  
        };

        if (documentId && db) {
            db.jobSeekers?.update(documentId, updatedData)
                .then(() => {
                    console.log("Document updated successfully");
                })
                .catch((error) => {
                    console.error("Error updating document:", error);
                });
        } else if (db) {
            db.jobSeekers?.create(updatedData)
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
                <div className="form-group col-lg-6 col-md-12">
                    <label>Full Name</label>
                    <input
                        type="text"
                        name="name"
                        placeholder="Jerome"
                        value={formData.name}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Job Title</label>
                    <input
                        type="text"
                        name="jobTitle"
                        placeholder="UI Designer"
                        value={formData.jobTitle}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Country</label>
                    <input
                        type="text"
                        name="country"
                        placeholder="Germany"
                        value={formData.country}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>City</label>
                    <input
                        type="text"
                        name="city"
                        placeholder="Frankfurt"
                        value={formData.city}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Age</label>
                    <input
                        type="number"
                        name="age"
                        placeholder={0}
                        value={formData.age}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Expected Salary Range</label>
                    <input
                        type="text"
                        name="expectedSalaryRange"
                        placeholder="90k-100k"
                        value={formData.expectedSalaryRange}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Experience (Years)</label>
                    <input
                        type="number"
                        name="experience"
                        placeholder="5"
                        value={formData.experience}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Gender</label>
                    <select
                        name="gender"
                        className="chosen-single form-select"
                        value={formData.gender}
                        required
                        onChange={handleInputChange}
                    >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Others">Others</option>
                    </select>
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Education Levels</label>
                    <input
                        type="text"
                        name="educationalLevel"
                        placeholder="Certificate"
                        value={formData.educationalLevel}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Categories</label>
                    <Select
                        value={selectedCategory}
                        isMulti
                        name="categoryTags"
                        options={catOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleCategoryChange}
                        placeholder="Select Category"
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Skills</label>
                    <Select
                        value={skillsOptions}
                        isMulti
                        name="skills"
                        options={catOptions}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={handleSkillsChange}
                        placeholder="Select Skills"
                    />
                </div>

                <div className="form-group col-lg-6 col-md-12">
                    <label>Languages</label>
                    <input
                        type="text"
                        name="languages"
                        placeholder="English, Turkish"
                        value={formData.languages}
                        required
                        onChange={handleInputChange}
                    />
                </div>

                <div className="form-group col-lg-12 col-md-12">
                    <label>Description</label>
                    <textarea
                        name="description"
                        placeholder="Description about yourself"
                        value={formData.description}
                        onChange={handleInputChange}
                    ></textarea>
                </div>

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
