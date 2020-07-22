import { useStyletron } from "baseui";

async function getStaticPaths() {
  const { getPages } = require("../lib/api");
  const [pages] = await getPages();
  const paths = pages
    .reduce((acc, page) => {
      return [...acc, ...page.children];
    }, [])
    .map((frame) => ({ params: { nodeId: frame.id } }));
  return { paths, fallback: true };
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
  const [css] = useStyletron();
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
            minHeight: "calc(100vh - 60px)",
            border: "0",
          }}
        />
      ) : (
        <div
          className={css({
            width: "100%",
            height: "calc(100vh - 60px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          })}
        >
          Yikes! There was a problem rendering this page.
        </div>
      )}
    </>
  );
}

export { Node as default, getStaticPaths, getStaticProps };
