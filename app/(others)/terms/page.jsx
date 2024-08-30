import dynamic from "next/dynamic";

import Terms from "@/components/pages-menu/terms";

export const metadata = {
  title: 'Terms || DIGI-X-TECH - Job Borad React NextJS Template',
  description:
    'DIGI-X-TECH - Job Borad React NextJS Template',
  
}



const index = () => {
  return (
    <>
      
      <Terms />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
