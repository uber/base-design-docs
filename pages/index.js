import Head from "next/head";

async function getStaticProps() {
  let pages = [];
  try {
    // Figma file structure: File > Pages > Frames.

    // By convention we turn the top level Figma Frames for each Figma Page
    // into web pages. The Figma Pages become headers for grouping the pages
    // in our navigation.

    // Fetch Figma file 2 levels deep. We only need Figma Pages & the
    // top level Figma Frames within them.
    const figmaFileResponse = await fetch(
      `https://api.figma.com/v1/files/${process.env.FIGMA_FILE_ID}?depth=2`,
      {
        headers: {
          "X-FIGMA-TOKEN": process.env.FIGMA_AUTH_TOKEN,
        },
      }
    );
    const figmaFile = await figmaFileResponse.json();

    // By convention, only use Figma Pages starting with a capital letter.
    const figmaPages = figmaFile.document.children.filter((page) =>
      page.name.match(/^[A-Z]/)
    );

    // We need both the Figma Page as well as its children (top level frames).
    pages = figmaPages;
  } catch (er) {
    console.log("there was a problem fetching the figma file");
    console.log(er);
  }

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
