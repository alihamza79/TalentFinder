import LoginPopup from "@/components/common/form/login/LoginPopup";
import Partner from "@/components/common/partner/Partner";
import FooterDefault from "@/components/footer/common-footer";
import DefaulHeader from "@/components/header/DefaulHeader";
import MobileMenu from "@/components/header/MobileMenu";
import AddBlock from "@/components/block/AddBlock";
import Block8 from "@/components/block/Block8";
import JobCategorie2 from "@/components/job-categories/JobCategorie2";
import FaqChild from "@/components/pages-menu/faq/FaqChild";
import Breadcrumb from "@/components/common/Breadcrumb";

const index = () => {
    const missionVisionValues = [
        {
          id: 1,
          bgImageName: "ads-bg-1",
          title: (
            <>
              {" "}
              <span>DIGI-X-TECH </span>Portal
            </>
          ),
          content: "In addition to the digital and energy transformations, the most important issue of the coming years will be demographic developments. Germany will face a shortage of more than five million workers by 2035. DIGI-X-TECH was founded to bring together German companies and international talent selected by us, thus increasing Germany's economic strength."
        },
        {
          id: 2,
          bgImageName: "ads-bg-2",
          title: (
            <>
              {" "}
              <span>DIGI-X-TECH </span>Assurance
            </>
          ),
          content:"Globalization and network development have become indispensable in many sectors of the economy. The employment of experts and managers has fallen short of the targets set, especially in technical professions. With the innovative DIGI-X-TECH platform, our recruitment centers operating in Turkey and abroad, and our personal services, we support companies in finding the best employees. At the same time, we see ourselves as a guide for talents and accompany them on their career paths. As a reliable partner, we want to expand our service worldwide."
        },
        {
          id: 3,
          bgImageName: "ads-bg-3",
          title: (
            <>
              {" "}
              <span>DIGI-X-TECH </span>Principles
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

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      <Breadcrumb title="Shape your career with us by creating a profile that will attract the attention of employers!" meta="Skills" />
      {/* <!--End Page Title--> */}

      <section className="ads-section">
        <div className="auto-container">
          <div className="row" data-aos="fade-up">
            <AddBlock items={missionVisionValues}/>
            {/* <!-- Ads Block --> */}
          </div>
        </div>
      </section>
      {/* <!-- End Ads Section --> */}

      <section className="layout-pt-120 layout-pb-120 ">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Our Services</h2>
            {/* <div className="text">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
              eiusmod
            </div> */}
          </div>
          {/* End sec-title */}

          <div className="row grid-base pt-50 items-center" data-aos="fade-up">
            <Block8 />
            {/* <!-- Work Block --> */}
          </div>
        </div>
      </section>
      {/* <!-- End Services Section --> */}

      <section className="job-categories">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>DIG-X-TECH Portal Membership</h2>
            <div className="text">You can benefit from the following services with a premium membership on our platform.</div>
          </div>

          <div className="row" data-aos="fade-up">
            <JobCategorie2 />
          </div>
        </div>
      </section>
      {/* <!-- End Premium Membership Services Categories --> */}

      <section className="faqs-section">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Frequently Asked Questions</h2>
          </div>
          {/* <!--Accordian Box--> */}
          <ul className="accordion-box">
            <FaqChild />
          </ul>
        </div>
      </section>
      {/* <!-- End Faqs Section --> */}

      <FooterDefault />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default index;
