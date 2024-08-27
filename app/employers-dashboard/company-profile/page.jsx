'use client';

import dynamic from "next/dynamic";
import CompanyProfile from "@/components/dashboard-pages/employers-dashboard/company-profile";
import { FormDataProvider, useFormData } from "@/context/FormDataContext";
import { useEffect, useState } from "react";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";
import db from "@/appwrite/Services/dbServices";
import * as sdk from "node-appwrite";

const CompanyProfilePage = () => {
  const { user, loading } = useAuth();
  const { formData } = useFormData();
  const router = useRouter();
  const [documentId, setDocumentId] = useState(null);

  // useEffect(() => {
  //   if (!loading) {
  //     if (!user || !user.team) {
  //       router.push("/login"); // Redirect to login if user is not authenticated or team is undefined
  //     } else if (user.team !== 'companies') {
  //       router.push("/"); // Redirect if the user is not in the companies team
  //     } else {
  //       // Fetch the document from the Company collection where userId matches
  //       db.company.list([sdk.Query.equal('userId', user.userId)])
  //         .then((response) => {
  //           if (response.documents.length > 0) {
  //             setDocumentId(response.documents[0].$id);
  //           } else {
  //             console.error("No document found for this user");
  //           }
  //         })
  //         .catch((error) => {
  //           console.error("Error fetching document:", error);
  //         });
  //     }
  //   }
  // }, [user, loading, router]);

  // useEffect(() => {
  //   if (documentId) {
  //     // Safeguard with optional chaining and default values
  //     const updatedData = {
  //       name: formData?.companyInfo?.companyName || '',
  //       email: formData?.companyInfo?.email || '',
  //       phone: formData?.companyInfo?.phone || '',
  //       website: formData?.companyInfo?.website || '',
  //       since: formData?.companyInfo?.estSince || '',
  //       companySize: formData?.companyInfo?.teamSize || '',
  //       allowListingVisibility: formData?.companyInfo?.allowListing || '',
  //       aboutCompany: formData?.companyInfo?.aboutCompany || '',
  //       categoryTags: formData?.companyInfo?.category?.map(cat => cat.value) || [],
  //       socials: [
  //         formData?.socialInfo?.facebook || '',
  //         formData?.socialInfo?.googlePlus || '',
  //         formData?.socialInfo?.linkedin || '',
  //         formData?.socialInfo?.twitter || ''
  //       ],
  //       city: formData?.contactInfo?.city || '',
  //       address: formData?.contactInfo?.address || '',
  //       country: formData?.contactInfo?.country || '',
  //     };

  //     db.company.update(documentId, updatedData)
  //       .then(() => {
  //         console.log("Document updated successfully");
  //       })
  //       .catch((error) => {
  //         console.error("Error updating document:", error);
  //       });
  //   }
  // }, [formData, documentId]);

  // // Render loading state
  // if (loading) {
  //   return <p>Loading...</p>;
  // }

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

