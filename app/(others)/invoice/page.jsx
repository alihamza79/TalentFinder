import dynamic from "next/dynamic";

import Invoice from "@/components/pages-menu/invoice";

export const metadata = {
  title: 'Invoice || DIGI-X-TECH - Job Borad React NextJS Template',
  description:
    'DIGI-X-TECH - Job Borad React NextJS Template',
  
}



const index = () => {
  return (
    <>
      
      <Invoice />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
