"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const Header = () => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

  return (
    <header
      className={`main-header ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      <div className="container-fluid">
        <div className="main-box">
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <Image
                    width={154}
                    height={50}
                    src="/images/logo-2.svg"
                    alt="logo"
                    title="brand"
                    className="noSticky"
                  />
                </Link>
                <Link href="/">
                  <Image
                    width={154}
                    height={50}
                    src="/images/logo.svg"
                    alt="logo"
                    title="brand"
                    className="isSticky"
                  />
                </Link>
              </div>
            </div>
          </div>

          <div className="outer-box">
            <div className="btn-box">
              <Link href="/employers-dashboard/post-jobs">
                <span className="theme-btn btn-style-one">
                  <span className="btn-title">Job Post</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
