import Link from "next/link";
import membershipServices from "../../data/membershipServices";

const JobCategorie2 = () => {
  return (
    <>
      {membershipServices.slice(0, 8).map((item) => (
        <div
          className="category-block-two col-xl-3 col-lg-4 col-md-6 col-sm-12 d-flex"
          key={item.id}
        >
          <div className="inner-box  flex-column h-100">
            <div className="content flex-grow-1">
              <span className={`icon ${item.icon}`}></span>
              <h4>
                <Link href="/job-list-v2">{item.title}</Link>
              </h4>
              <p>{item.content} open positions</p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default JobCategorie2;
