import { useEffect, useContext } from "react";
import Image from "next/image";
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

function Page({
  image,
}: {
  image: { src: string; height: number; width: number };
}) {
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
      <Image
        {...image}
        id="frame-image"
        alt={activePage.name}
        className={css({
          boxShadow: theme.lighting.shadow700,
        })}
      />
    </div>
  );
}

export { Page as default, getStaticPaths, getStaticProps };
