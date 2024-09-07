const Social = ({ linkedin, twitter, github }) => {
  const socialContent = [
    { id: 1, icon: "fa-linkedin-in", link: linkedin },
    { id: 2, icon: "fa-twitter", link: twitter },
    { id: 3, icon: "fa-github", link: github },
  ];

  return (
    <div className="social-links">
      {socialContent
        .filter((item) => item.link)
        .map((item) => (
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            key={item.id}
          >
            <i className={`fab ${item.icon}`}></i>
          </a>
        ))}
    </div>
  );
};

export default Social;
