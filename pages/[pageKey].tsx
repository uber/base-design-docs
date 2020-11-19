import { useEffect, useContext, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
import { useStyletron } from "baseui";
import { Button } from "baseui/button";
import { PageContext } from "../components/layout";
import { Figma, LeftArrowIcon, RightArrowIcon } from "../components/icons";
import * as gtag from "../lib/gtag";
import { useSiblingPages } from "../lib/hooks";
import { ImageData } from "../lib/types";

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

function Page({ image }: { image: ImageData }) {
  const [css, theme] = useStyletron();
  const { activePage, siteMap, figmaLink } = useContext(PageContext);
  const router = useRouter();

  // Scroll to top of page when image changes.
  useEffect(() => {
    window.scroll({ top: 0 });
  }, [image]);

  const [previousPage, nextPage] = useSiblingPages(siteMap, activePage.key);
  const title = useMemo(
    () => `${activePage.sectionName} → ${activePage.name}`,
    [activePage]
  );

  return (
    <div
      className={css({
        display: "flex",
        flexDirection: "column",
        maxWidth: "1280px",
      })}
    >
      <Head>
        <title>{title}</title>
        <meta property="og:title" content={title} key="title" />
      </Head>
      <div
        className={css({
          display: "flex",
          ...theme.borders.border300,
          borderWidth: "2px",
          background: theme.colors.white,
          marginBottom: theme.sizing.scale800,
        })}
      >
        <Image {...image} id="frame-image" key={activePage.key} alt={title} />
      </div>
      <div
        className={css({ display: "flex", justifyContent: "space-between" })}
      >
        <Button
          kind="secondary"
          startEnhancer={() => <LeftArrowIcon />}
          // @ts-ignore - Missing type in baseui
          title="Previous page"
          onClick={() => router.push("/[pageKey]", `/${previousPage.key}`)}
        >
          {previousPage.sectionName}: {previousPage.name}
        </Button>
        <Button
          // @ts-ignore - Missing type in baseui
          $as="a"
          href={figmaLink}
          target="_blank"
          rel="noopener"
          kind="secondary"
          shape="circle"
          title="Open in Figma"
          onClick={() => {
            gtag.event({
              action: "click_link_header_external",
              category: "navigation",
              label: activePage.key ? `figma_${activePage.key}` : "figma_root",
            });
          }}
        >
          <Figma size="16px" />
        </Button>
        <Button
          kind="secondary"
          endEnhancer={() => <RightArrowIcon />}
          onClick={() => router.push("/[pageKey]", `/${nextPage.key}`)}
          // @ts-ignore - Missing type in baseui
          title="Next page"
        >
          {nextPage.sectionName}: {nextPage.name}
        </Button>
      </div>
    </div>
  );
}

export { Page as default, getStaticPaths, getStaticProps };
