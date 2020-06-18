async function getStaticPaths() {
  const { getPages } = require("../lib/api");
  const [pages] = await getPages();
  const paths = pages
    .reduce((acc, page) => {
      return [...acc, ...page.children];
    }, [])
    .map((frame) => ({ params: { nodeId: frame.id } }));
  return { paths, fallback: false };
}

async function getStaticProps({ params }) {
  const { getPages, getImage } = require("../lib/api");
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

function Node({ image }: { image: string }) {
  return (
    <>
      {image ? (
        <embed
          id="pdf"
          title="Figma PDF"
          type="application/pdf"
          src={image}
          style={{
            display: "block",
            width: "100%",
            minHeight: "calc(100vh - 70px)",
            border: "0",
          }}
        />
      ) : (
        "No Figma node found."
      )}
    </>
  );
}

export { Node as default, getStaticPaths, getStaticProps };
