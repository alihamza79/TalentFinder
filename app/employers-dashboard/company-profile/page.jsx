'use client';

import dynamic from "next/dynamic";
import CompanyProfile from "@/components/dashboard-pages/employers-dashboard/company-profile";
import { FormDataProvider, useFormData } from "@/context/FormDataContext";
import { useEffect } from "react";
import useAuth from "@/app/hooks/useAuth";
import { useRouter } from "next/navigation";

const CompanyProfilePage = () => {
  const { user, loading } = useAuth();
  const { formData } = useFormData();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user || !user.team) {
        // Redirect to login if user is not authenticated or team is undefined
        router.push("/login");
      } else if (user.team !== 'companies') {
        // Redirect if the user is not in the companies team
        router.push("/");
      }
    }

    console.log(formData)
  }, [user, loading, router,formData]);

  // Render loading state
  if (loading) {
    return <p>Loading...</p>;
  }

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
