import Layout from "../components/layout.js";

async function getStaticProps() {
  const { getPages } = require("../figma/api.js");
  const [pages, fileName] = await getPages();
  return {
    props: {
      pages,
      fileId: process.env.FIGMA_FILE_ID,
      fileName,
    },
  };
}

function Home({ pages }) {
  return <Layout pages={pages}>Home</Layout>;
}

export { Home as default, getStaticProps };
