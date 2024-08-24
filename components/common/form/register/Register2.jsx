'use client'

import { useState , useEffect} from 'react'; // Import useState hook
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LoginWithSocial from "./LoginWithSocial";
import FormContent from "./FormContent";
import Link from "next/link";

const Register2 = () => {

  const [isEmployer, setIsEmployer] = useState(false); // State to track whether it's an employer or not

  return (
    <div className="form-inner">
      <h3>Create a free DIGI-X-TECH Account</h3>

      <Tabs onSelect={(index) => setIsEmployer(index === 1)}> {/* Update isEmployer based on the selected tab */}
        <div className="form-group register-dual">
          <TabList className="btn-box row">
            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-user"></i> Candidate
              </button>
            </Tab>

            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-briefcase"></i> Employer
              </button>
            </Tab>
          </TabList>
        </div>
        {/* End .form-group */}

        <TabPanel>
          <FormContent isEmployer={false} /> {/* Pass false for candidates */}
        </TabPanel>
        {/* End Candidate Form */}

        <TabPanel>
          <FormContent isEmployer={true} /> {/* Pass true for employers */}
        </TabPanel>
        {/* End Employer Form */}
      </Tabs>
      {/* End form-group */}

      <div className="bottom-box">
        <div className="text">
          Already have an account?{" "}
          <Link href="/login" className="call-modal login">
            LogIn
          </Link>
        </div>
        <div className="divider">
          <span>or</span>
        </div>
        <LoginWithSocial />
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default Register2;
