import Head from "next/head";

const PageTemplate = ({ heading, children }) => {
  const links = [
    {
      href: "/",
      label: "Generate New Report",
    },
    {
      href: "/reports",
      label: "View Past Reports",
    },
    {
      href: "/query",
      label: "Query Past Reports",
    },
  ];

  return (
    <div className="w-full h-full flex justify-center">
      <Head>
        <title>Interview Report Automation</title>
        <meta name="description" content="AssemblyAI Speech To Text App" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full max-w-3xl p-2 py-12">
        <h1 className="text-center font-semibold text-3xl mb-8">
          📋 Interview Report Automation
        </h1>

        <div className="text-center">
          <ul className="flex list-none mb-12 text-underline no-underline items-center justify-center">
            {links.map((link) => (
              <li className="mr-6" key={link.href}>
                <a
                  className="text-blue-500 hover:text-blue-800 no-underline"
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <h2 className="text-center font-semibold text-xl mb-3">{heading}</h2>

        {children}
      </div>
    </div>
  );
};

export default PageTemplate;
