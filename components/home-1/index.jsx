import Link from "next/link";
import About from "../about/About";
import AppSection from "../app-section/AppSection";
import Blog from "../blog/Blog";
import CallToAction from "../call-to-action/CallToAction";
import LoginPopup from "../common/form/login/LoginPopup";
import Partner from "../common/partner/Partner";
import FooterDefault from "../footer/common-footer";
import Funfact from "../fun-fact-counter/Funfact";
import DefaulHeader2 from "../header/DefaulHeader2";
import MobileMenu from "../header/MobileMenu";
import Hero3 from "../hero/hero-3";
import RegBanner2 from "../block/RegBanner2";
import Block8 from "../block/Block8";
import CallToAction11 from "../call-to-action/CallToAction11";
import About2 from "../about/About2";
import Testimonial3 from "../testimonial/Testimonial3";
import FaqChild from "../pages-menu/faq/FaqChild";


import JobCategorie1 from "../job-categories/JobCategorie1";
import JobFeatured1 from "../job-featured/JobFeatured1";
import Testimonial from "../testimonial/Testimonial";
import TopCompany from "../top-company/TopCompany";
import Candidates from "../candidates/Candidates";



const index = () => {
  return (
    <>
      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader2 />
      {/* End Header with upload cv btn */}

      <MobileMenu />
      {/* End MobileMenu */}

      <Hero3 />
      {/* End Hero Section */}


      <section className="job-categories ui-job-categories">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Popular Job Categories</h2>
            <div className="text">2020 jobs live - 293 added today.</div>
          </div>

          <div
            className="row "
            data-aos="fade-up"
            data-aos-anchor-placement="top-bottom"
          >
            {/* <!-- Category Block --> */}
            <JobCategorie1 />
          </div>
        </div>
      </section>
      {/* End Job Categorie Section */}

      <section className="job-section">
        <div className="auto-container">
          <div className="sec-title text-center">
            <h2>Featured Jobs</h2>
            <div className="text">
              Know your worth and find the job that qualify your life
            </div>
          </div>

          <div className="row " data-aos="fade-up">
            <JobFeatured1 />
          </div>

          <div className="btn-box">
            <Link
              href="/job-list-v5"
              className="theme-btn btn-style-one bg-blue"
            >
              <span className="btn-title">Load More Listing</span>
            </Link>
          </div>
        </div>
      </section>
      {/* End Job Featured Section */}

      <section className="top-companies">
        <div className="auto-container">
          <div className="sec-title">
            <h2>Top Company Registered</h2>
            <div className="text">
              Some of the companies we have helped recruit excellent applicants
              over the years.
            </div>
          </div>

          <div className="carousel-outer" data-aos="fade-up">
            <div className="companies-carousel">
              <TopCompany />
            </div>
          </div>
          <div className="btn-box text-center">
            <Link
              href="/employers-list-v3"
              className="theme-btn btn-style-one bg-blue"
            >
              <span className="btn-title">Load More Companies</span>
            </Link>
          </div>
        </div>
      </section>
      {/* <!-- End Top Companies --> */}

      <section className="candidates-section">
        <div className="auto-container">
          <div className="sec-title">
            <h2>Featured Candidates</h2>
            <div className="text">
              Lorem ipsum dolor sit amet elit, sed do eiusmod tempor
            </div>
          </div>

          <div className="carousel-outer" data-aos="fade-up">
            <div className="candidates-carousel default-dots">
              <Candidates />
            </div>
          </div>
          <div className="btn-box text-center">
            <Link
              href="/candidates-list-v3"
              className="theme-btn btn-style-one bg-blue"
            >
              <span className="btn-title">Load More Candidates</span>
            </Link>
          </div>
        </div>
      </section>
      {/* <!-- End Candidates Section --> */}


      <section className="registeration-banners">
        <div className="auto-container">
          <div className="row" data-aos="fade-up">
            <RegBanner2 />
          </div>
        </div>
      </section>
      {/* <!-- End Skills/Companies Banners -->  */}



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


      <section className="about-section-two">
        <div className="auto-container">
          <div className="row">
            <About2 />
          </div>
        </div>
      </section>
      {/* <!-- End About Section --> */}

      <section className="testimonial-section-three">
        <div className="auto-container">
          {/* <!-- Sec Title --> */}
          <div className="sec-title text-center text-5xl font-medium">
           Holistic solutions are needed.
            {/* <div className="text">
              Lorem ipsum dolor sit amet elit, sed do eiusmod tempor
            </div> */}
          </div>
          {/* End sec-title */}

          <div className="carousel-outer" data-aos="fade-up">
            {/* <!-- Testimonial Carousel --> */}
            <div className="testimonial-carousel">
              <Testimonial3 />
            </div>
          </div>
        </div>
        {/* End auto-container */}
      </section>

      <CallToAction11 />
      {/* <!-- End CallToAction Section --> */}


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
