import LoginPopup from "@/components/common/form/login/LoginPopup";
import Partner from "@/components/common/partner/Partner";
import FooterDefault from "@/components/footer/common-footer";
import DefaulHeader from "@/components/header/DefaulHeader";
import MobileMenu from "@/components/header/MobileMenu";
import Funfact from "@/components/fun-fact-counter/Funfact";
import ImgBox from "@/components/pages-menu/about/ImgBox";
import IntroDescriptions from "@/components/pages-menu/about/IntroDescriptions";
import CallToAction2 from "@/components/call-to-action/CallToAction2";
import Testimonial2 from "@/components/testimonial/Testimonial2";
import Block1 from "@/components/block/Block1";
import Breadcrumb from "@/components/common/Breadcrumb";
import Image from "next/image";

const index = () => {
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

      <Breadcrumb title="About Us" meta="About Us" />
      {/* <!--End Page Title--> */}

          <FooterDefault />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default index;
