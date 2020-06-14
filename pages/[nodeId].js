import Layout from "../components/layout.js";

async function getStaticPaths() {
  const { getPages } = require("../figma/api.js");
  const [pages] = await getPages();
  const paths = pages
    .reduce((acc, page) => {
      return [...acc, ...page.children];
    }, [])
    .map((frame) => ({ params: { nodeId: frame.id } }));
  return { paths, fallback: false };
}

async function getStaticProps({ params }) {
  const { getPages, getImage } = require("../figma/api.js");
  const [pages, fileName] = await getPages();
  const image = await getImage(params.nodeId);
  return {
    props: {
      pages,
      image,
      nodeId: params.nodeId,
      fileId: process.env.FIGMA_FILE_ID,
      fileName,
    },
  };
}

function Node({ pages, image, nodeId, fileId, fileName }) {
  return (
    <Layout pages={pages} nodeId={nodeId} fileId={fileId} fileName={fileName}>
      {image ? (
        <embed
          id="pdf"
          title="Figma PDF"
          type="application/pdf"
          src={image}
          style={{
            display: "block",
            width: "100%",
            height: "100vh",
            border: "0",
          }}
        />
      ) : (
        "No Figma node found."
      )}
    </Layout>
  );
}

export { Node as default, getStaticPaths, getStaticProps };
