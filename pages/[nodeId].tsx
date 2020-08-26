import { useStyletron } from "baseui";
import { MQ } from "../lib/constants";

async function getStaticPaths() {
  const { getPages } = require("../lib/api");
  const pages = await getPages();
  const paths = pages
    .reduce((acc, page) => {
      return [...acc, ...page.children];
    }, [])
    .map((frame) => ({ params: { nodeId: frame.id } }));
  return { paths, fallback: false };
}

async function getStaticProps({ params }) {
  const { getPages, getImage } = require("../lib/api");
  const pages = await getPages();
  const page = pages.find((page) =>
    page.children.find((frame) => frame.id === params.nodeId)
  );
  const frame = page.children[0];
  const image = await getImage(frame.fileKey, params.nodeId);
  return {
    props: {
      pages,
      image,
      nodeId: params.nodeId,
      fileId: frame.fileKey,
      fileName: frame.fileName,
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
          className={css({
            display: "block",
            width: "100%",
            border: "0",
            minHeight: "calc(100vh - 124px)",
            [MQ.medium]: {
              minHeight: "calc(100vh - 60px)",
            },
          })}
        />
      ) : (
        <div
          className={css({
            width: "100%",
            height: "calc(100vh - 124px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            [MQ.medium]: {
              height: "calc(100vh - 60px)",
            },
          })}
        >
          Yikes! There was a problem rendering this page.
        </div>
      )}
    </>
  );
}

export { Node as default, getStaticPaths, getStaticProps };
