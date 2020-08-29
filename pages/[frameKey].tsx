import { useEffect } from "react";
import { useStyletron } from "baseui";
import { MQ } from "../lib/constants";

async function getStaticPaths() {
  const { getPages } = require("../lib/api");
  const pages = await getPages();
  let paths = [];
  for (const page of pages) {
    if (page && page.children) {
      paths = [
        ...paths,
        ...page.children.map((frame) => ({
          params: { frameKey: frame.key },
        })),
      ];
    }
  }
  return { paths, fallback: false };
}

async function getStaticProps({ params }) {
  const { getPages, getImage } = require("../lib/api");
  const pages = await getPages();
  let activeFrame;
  for (const page of pages) {
    const foundFrame = page.children.find(
      (frame) => frame.key === params.frameKey
    );
    if (foundFrame) {
      activeFrame = foundFrame;
      break;
    }
  }
  const image = await getImage(activeFrame);
  return {
    props: {
      image,
      pages,
      activeFrame,
      figmaLink: `https://www.figma.com/file/${activeFrame.fileKey}/${activeFrame.fileName}?node-id=${activeFrame.id}`,
    },
  };
}

function Node({ image }: { image: string }) {
  const [css] = useStyletron();

  // Scroll to top of page when image changes.
  useEffect(() => {
    window.scroll({ top: 0 });
  }, [image]);

  return (
    <>
      {image ? (
        <img
          id="pdf"
          title="Figma PDF"
          // type="application/pdf"
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
