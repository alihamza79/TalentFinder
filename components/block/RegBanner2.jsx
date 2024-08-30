import Image from "next/image";
import Link from "next/link";

const RegBanner2 = () => {
  const regBannerContent = [
    {
      id: 1,
      name: "Skills",
      text: `Find suitable jobs and strong employers, apply to them or let companies find you easily and conveniently.
With Talendox we offer you a first-class service - personalized and individual.`,
      avatar: "/images/resource/employ.png",
      bannerClass: "banner-style-one",
      width: "221",
      height: "281",
    },
    {
      id: 2,
      name: "Companies",
      text: `Reach a new, international target group of qualified and certified experts. Position yourself with a perfect company profile and job postings.
Our employees will be happy to support you.`,
      avatar: "/images/resource/candidate.png",
      bannerClass: "banner-style-two",
      width: "207",
      height: "283",
    },
  ];
  return (
    <>
      {regBannerContent.map((item) => (
        <div
          className={`${item.bannerClass} -type-2 col-lg-6 col-md-12 col-sm-12`}
          key={item.id}
        >
          <div className="inner-box">
            <div className="">
              <h3>{item.name}</h3>
              <p>{item.text}</p>
              <Link href="/register" className="theme-btn btn-style-five">
                Register Account
              </Link>
            </div>
            {/* <figure className="image">
              <Image
                width={item.width}
                height={item.height}
                src={item.avatar}
                alt="resource"
              />
            </figure> */}
          </div>
        </div>
      ))}
    </>
  );
};

export default RegBanner2;
