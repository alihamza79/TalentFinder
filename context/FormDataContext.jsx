// useFormData.js (where your formData is being managed)
import { createContext, useContext, useState } from "react";

const FormDataContext = createContext();

export const useFormData = () => useContext(FormDataContext);

export const FormDataProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    companyInfo: {
      companyName: '',
      email: '',
      phone: '',
      website: '',
      estSince: '',
      teamSize: '',
      allowListing: '',
      aboutCompany: '',
      category: []  // Initialize as an empty array
    },
    socialInfo: {
      facebook: '',
      googlePlus: '',
      linkedin: '',
      twitter: ''
    },
    contactInfo: {
      city: '',
      address: '',
      country: ''
    }
  });

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],  // Spread existing data in that section
        ...data  // Merge the new data
      }
    }));
  };

  return (
    <FormDataContext.Provider value={{ formData, updateFormData }}>
      {children}
    </FormDataContext.Provider>
  );
};
