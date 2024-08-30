import dynamic from "next/dynamic";
import ChangePassword from "@/components/dashboard-pages/employers-dashboard/change-password";

export const metadata = {
  title: "Change Password || DIGI-X-TECH - Job Borad React NextJS Template",
  description: "DIGI-X-TECH - Job Borad React NextJS Template",
};

const index = () => {
  return (
    <>
      <ChangePassword />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
