import Head from "next/head";

async function getStaticProps() {
  const { getPages } = require("../figma/api.js");
  const pages = await getPages();
  return { props: { pages } };
}

function Home({ pages }) {
  return (
    <div className="container">
      <Head>
        <title>Base - Documentation</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav>
        {pages.map((page) => (
          <div key={page.id}>
            <div>{page.name}</div>
            <div>
              {page.children.map((frame) => (
                <div key={frame.id}>
                  <a href={`/${frame.id.replace(":", "-")}`}>{frame.name}</a>
                </div>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </div>
  );
}

export { Home as default, getStaticProps };
