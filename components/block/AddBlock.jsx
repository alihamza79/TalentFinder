import Link from "next/link";

const AddBlock = ({ items }) => {
  return (
    <div className="flex flex-wrap ">
      {items.map((item) => (
        <div
          className="advrtise-block w-full md:w-1/2 lg:w-1/3 px-2 mb-4"
          key={item.id}
        >
          <div
            className="inner-box bg-blue-50 h-full flex flex-col "
            style={{
              // backgroundImage: `url(/images/resource/${item.bgImageName}.png)`,
            }}
          >
            <h4>{item.title}</h4>
            <div className="mt-2 flex-grow">
              <p>{item.content}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AddBlock;
