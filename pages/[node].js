async function getStaticPaths() {
  const { getPages } = require("../figma/api.js");
  const pages = await getPages();
  const paths = pages
    .reduce((acc, page) => {
      return [...acc, ...page.children];
    }, [])
    .map((frame) => ({ params: { node: frame.id } }));
  return { paths, fallback: false };
}

async function getStaticProps({ params }) {
  const { getPages, getImage } = require("../figma/api.js");
  const pages = await getPages();
  const image = await getImage(params.node);
  return {
    props: { pages, image },
  };
}

function Node({ pages, image }) {
  return (
    <div>
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
    </div>
  );
}

export { Node as default, getStaticPaths, getStaticProps };
