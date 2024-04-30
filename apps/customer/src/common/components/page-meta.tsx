import ReactHelmet from "react-helmet";

const PageMeta = ({
  title,
  description = "Eat Easer is a restaurant management system that helps you manage your restaurant business with ease.",
  ogTitle = title,
  ogDescription = description,
  ogImg = "https://eat-easer-customer.vercel.app/logo.svg",
}: {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImg?: string;
}) => {
  return (
    <ReactHelmet>
      <title>EatEaser | {`${title}`}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={ogTitle} />
      <meta property="og:description" content={ogDescription} />
      <meta property="og:image" content={ogImg} />
      <link rel="canonical" href="https://eat-easer-customer.vercel.app" />
    </ReactHelmet>
  );
};

export default PageMeta;
