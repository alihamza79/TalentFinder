import Image from "next/image";
import CopyrightFooter from "../footer/common-footer/CopyrightFooter";
import FooterContent from "../footer/common-footer/FooterContent";

const Footer = () => {
  return (
    <footer className="main-footer style-four">
      <div className="auto-container">
        {/* <!--Widgets Section--> */}
        <div className="widgets-section" data-aos="fade-up">
          <div className="row">
            <div className="big-column col-xl-4 col-lg-3 col-md-12">
              <div className="footer-column about-widget">
                <div className="logo">
                  <a href="#">
                    <Image
                  width={98}
                  height={1}
                  src="/images/jordii-logo.png"
                  alt="brand"
                />
                  </a>
                </div>
                <p className="phone-num">
                  <span>Call us </span>
                  <a href="thebeehost@support.com">123 456 7890</a>
                </p>
                <p className="address">
                  329 Queensberry Street, North Melbourne VIC
                  <br /> 3051, Australia. <br />
                  <a href="mailto:support@DIGI-X-TECH.com" className="email">
                    support@DIGI-X-TECH.com
                  </a>
                </p>
              </div>
            </div>
            {/* End footer left widget */}

            <div className="big-column col-xl-8 col-lg-9 col-md-12">
              <div className="row">
                <FooterContent />
              </div>
            </div>
            {/* End col-xl-8 */}
          </div>
        </div>
      </div>
      {/* End auto-container */}

      <CopyrightFooter />
      {/* <!--Bottom--> */}
    </footer>
  );
};

export default Footer;
