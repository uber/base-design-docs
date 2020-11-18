import { useEffect, useContext } from "react";
import Image from "next/image";
import Head from "next/head";
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
  const { activePage } = useContext(PageContext);

  // Scroll to top of page when image changes.
  useEffect(() => {
    window.scroll({ top: 0 });
  }, [image]);

  return (
    <div
      className={css({
        display: "flex",
      })}
    >
      <Head>
        <title>{activePage.title}</title>
        <meta property="og:title" content={activePage.title} key="title" />
      </Head>
      <div
        className={css({
          display: "flex",
          overflow: "hidden",
          ...theme.borders.border300,
          borderWidth: "2px",
          background: theme.colors.white,
        })}
      >
        <Image
          {...image}
          id="frame-image"
          key={activePage.key}
          alt={activePage.title}
        />
      </div>
    </div>
  );
}

export { Page as default, getStaticPaths, getStaticProps };
