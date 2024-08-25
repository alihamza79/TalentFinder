'use client'; // Add this to mark the component as a Client Component

import dynamic from "next/dynamic";
import CompanyProfile from "@/components/dashboard-pages/employers-dashboard/company-profile";
import { FormDataProvider, useFormData } from "@/context/FormDataContext";
import { useEffect } from "react";


const CompanyProfilePage = () => {
  const { formData } = useFormData();

  // Log the form data to the console whenever it changes
  useEffect(() => {
    console.log("Form Data: ", formData);
  }, [formData]);

  return (
    <>
      <CompanyProfile />
    </>
  );
};

export default dynamic(() => Promise.resolve(() => (
  <FormDataProvider>
    <CompanyProfilePage />
  </FormDataProvider>
)), { ssr: false });
