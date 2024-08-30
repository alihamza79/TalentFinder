import dynamic from "next/dynamic";

import Contact from "@/components/pages-menu/contact";

export const metadata = {
  title: 'Contact || DIGI-X-TECH - Job Borad React NextJS Template',
  description:
    'DIGI-X-TECH - Job Borad React NextJS Template',
  
}



const index = () => {
  return (
    <>
      
      <Contact />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
