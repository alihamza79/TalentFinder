import LoginPopup from "../../common/form/login/LoginPopup";
import About from "@/components/about/About";
import AddBlock from "@/components/block/AddBlock";
import Candidates3 from "@/components/candidates/Candidates3";
import Partner from "../../common/partner/Partner";
import FooterDefault from "../../footer/common-footer";
import DefaulHeader from "../../header/DefaulHeader";
import DefaulHeader2 from "@/components/header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";
import Funfact from "../../fun-fact-counter/Funfact";
import ImgBox from "./ImgBox";
import IntroDescriptions from "./IntroDescriptions";
import CallToAction2 from "../../call-to-action/CallToAction2";
import Testimonial2 from "../../testimonial/Testimonial2";
import Block1 from "../../block/Block1";
import Breadcrumb from "../../common/Breadcrumb";
import Image from "next/image";
import Link from "next/link";

const index = () => {
  const blockContent = [
    {
      id: 1,
      bgImageName: "ads-bg-1",
      title: (
        <>
          {" "}
          <span>Our Mission</span>
        </>
      ),
      content: "In addition to the digital and energy transformations, the most important issue of the coming years will be demographic developments. Germany will face a shortage of more than five million workers by 2035. Talendox was founded to bring together German companies and international talent selected by us, thus increasing Germany's economic strength."
    },
    {
      id: 2,
      bgImageName: "ads-bg-2",
      title: (
        <>
          {" "}
          <span>Our Vision</span>
        </>
      ),
      content:"Globalization and network development have become indispensable in many sectors of the economy. The employment of experts and managers has fallen short of the targets set, especially in technical professions. With the innovative Talendox platform, our recruitment centers operating in Turkey and abroad, and our personal services, we support companies in finding the best employees. At the same time, we see ourselves as a guide for talents and accompany them on their career paths. As a reliable partner, we want to expand our service worldwide."
    },
    {
      id: 3,
      bgImageName: "ads-bg-3",
      title: (
        <>
          {" "}
          <span>Our Values</span>
        </>
      ),
      content: `Trust: We see ourselves as stakeholders and supporters and work for long-term cooperation with companies and talents. Trust is the basis of our work.
- Professionalism: We provide all our services at a professional and high level, your satisfaction is our priority.
- Innovation: We facilitate the processes within talent and job search by constantly developing innovative functions. Our portal is constantly being developed for this purpose.`
    },
  ];
  return (
    <>
      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      <Breadcrumb title="About Us" meta="About Us" />
      {/* <!--End Page Title--> */}

      <section className="about-section">
        <div className="auto-container">
          <div className="row">
            <About />
          </div>
        </div>
      </section>
      {/* <!-- End About Section --> */}

      <section className="ads-section">
        <div className="auto-container">
          <div className="row" data-aos="fade-up">
            <AddBlock items={blockContent}/>
            {/* <!-- Ads Block --> */}
          </div>
        </div>
      </section>
      {/* <!-- End Ads Section --> */}

      <section className="layout-pt-60 layout-pb-120">
        <div className="auto-container">
            {/* <div className="col-lg-6"> */}
              <h2 className="text-4xl font-semibold">Our Team</h2>
            {/* </div> */}
          <div className="row grid-base pt-50" data-aos="fade-up">
            <Candidates3 />
          </div>
          {/* End .row */}
        </div>
      </section>
      {/* <!-- End Featured Canditates --> */}

      <FooterDefault />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default index;
