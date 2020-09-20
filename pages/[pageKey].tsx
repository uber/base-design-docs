import { useEffect, useContext } from "react";
import { useStyletron } from "baseui";
import { PageContext } from "../components/layout";

async function getStaticPaths() {
  const { getSiteMap } = require("../lib/api");
  const siteMap = await getSiteMap();
  const paths = [];
  for (const section of siteMap) {
    for (const page of section.children) {
      paths.push({
        params: { pageKey: page.key },
      });
    }
  }
  return { paths, fallback: false };
}

async function getStaticProps({ params }) {
  const { getSiteMap, getImage } = require("../lib/api");
  const siteMap = await getSiteMap();
  let activePage;
  for (const section of siteMap) {
    const match = section.children.find((page) => page.key === params.pageKey);
    if (match) {
      activePage = match;
      break;
    }
  }
  const image = await getImage(activePage);
  return {
    props: {
      image,
      siteMap,
      activePage,
      figmaLink: `https://www.figma.com/file/${activePage.fileKey}/${activePage.fileName}?node-id=${activePage.id}`,
    },
  };
}

function Page({ image }: { image: string }) {
  const [css, theme] = useStyletron();
  const { activePage = { name: "Base Documentation" } } = useContext(
    PageContext
  );

  // Scroll to top of page when image changes.
  useEffect(() => {
    window.scroll({ top: 0 });
  }, [image]);

  return (
    <div
      className={css({
        paddingLeft: theme.sizing.scale800,
        paddingRight: theme.sizing.scale800,
        [theme.mediaQuery.large]: {
          paddingBottom: theme.sizing.scale800,
        },
      })}
    >
      {image ? (
        <img
          id="frame-image"
          title={activePage.name}
          src={image}
          className={css({
            width: "100%",
            maxWidth: "1280px",
            boxShadow: theme.lighting.shadow700,
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
            [theme.mediaQuery.medium]: {
              height: "calc(100vh - 60px)",
            },
          })}
        >
          Yikes! There was a problem rendering this page.
        </div>
      )}
    </div>
  );
}

export { Page as default, getStaticPaths, getStaticProps };
