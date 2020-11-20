import { useEffect, useContext, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import Head from "next/head";
import { useStyletron } from "baseui";
import { Button } from "baseui/button";
import { PageContext } from "../components/layout";
import { Figma, LeftChevron, RightChevron } from "../components/icons";
import * as gtag from "../lib/gtag";
import { useSiblingPages } from "../lib/hooks";
import { ImageData, Page as PageT } from "../lib/types";
import { NONAME } from "dns";

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
        <Image
          {...image}
          id="frame-image"
          key={activePage.key}
          alt={title}
          quality={100}
        />
      </div>
      <div
        className={css({
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          [theme.mediaQuery.medium]: {
            flexWrap: "nowrap",
          },
        })}
      >
        <SiblingPageButton page={previousPage} direction={-1} />
        <SiblingPageButton page={nextPage} direction={1} />
        <FigmaButton page={activePage} figmaLink={figmaLink} />
      </div>
    </div>
  );
}

function FigmaButton({ page, figmaLink }: { page: PageT; figmaLink: string }) {
  const [css, theme] = useStyletron();
  return (
    <a
      href={figmaLink}
      target="_blank"
      rel="noreferrer"
      title="Open in Figma (F)"
      onClick={() => {
        gtag.event({
          action: "click_link_header_external",
          category: "navigation",
          label: page.key ? `figma_${page.key}` : "figma_root",
        });
      }}
      className={css({
        flex: 1,
        color: theme.colors.contentPrimary,
        background: theme.colors.backgroundTertiary,
        paddingLeft: theme.sizing.scale800,
        paddingRight: theme.sizing.scale800,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        order: 4,
        flexBasis: "100%",
        marginTop: theme.sizing.scale400,
        textDecoration: "none",
        outline: "none",
        transition: "background .2s ease-in-out",
        ":hover": {
          background: "#eaeaea",
        },
        ":focus-visible": {
          boxShadow: "0 0 0 3px " + theme.colors.accent,
        },
        [theme.mediaQuery.medium]: {
          order: 2,
          flexBasis: 0,
          marginTop: 0,
          marginLeft: theme.sizing.scale200,
          marginRight: theme.sizing.scale200,
        },
      })}
    >
      <div>
        <Figma size="16px" />
      </div>
      <div
        className={css({
          marginLeft: theme.sizing.scale300,
          ...theme.typography.ParagraphSmall,
          color: theme.colors.contentSecondary,
        })}
      >
        Open in Figma
      </div>
    </a>
  );
}

function SiblingPageButton({
  page,
  direction,
}: {
  page: PageT;
  direction: number;
}) {
  const router = useRouter();
  const [css, theme] = useStyletron();
  return (
    <div
      role="button"
      tabIndex={0}
      title={direction === -1 ? "Previous page (←)" : "Next page (→)"}
      onClick={() => router.push("/[pageKey]", `/${page.key}`)}
      className={css({
        flex: 1,
        display: "flex",
        justifyContent: direction === -1 ? "default" : "flex-end",
        alignItems: "center",
        background: theme.colors.backgroundTertiary,
        height: "65px",
        width: "50%",
        cursor: "pointer",
        outline: "none",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        paddingRight: direction === -1 ? 0 : theme.sizing.scale600,
        paddingLeft: direction === -1 ? theme.sizing.scale600 : 0,
        marginRight: direction === -1 ? theme.sizing.scale200 : 0,
        marginLeft: direction === -1 ? 0 : theme.sizing.scale200,
        transition: "background .2s ease-in-out",
        ":hover": {
          background: "#eaeaea",
        },
        ":focus-visible": {
          boxShadow: "0 0 0 3px " + theme.colors.accent,
        },
        order: direction === -1 ? 1 : 3,
      })}
    >
      <div
        className={css({
          order: direction === -1 ? "0" : "1",
          color: theme.colors.contentInverseTertiary,
          marginRight: direction === -1 ? theme.sizing.scale600 : 0,
          marginLeft: direction === -1 ? 0 : theme.sizing.scale600,
        })}
      >
        {direction === -1 ? <LeftChevron /> : <RightChevron />}
      </div>
      <div
        className={css({
          textAlign: direction === -1 ? "left" : "right",
        })}
      >
        <div
          className={css({
            ...theme.typography.LabelMedium,
            fontFamily: "UberMove",
            color: theme.colors.contentPrimary,
          })}
        >
          {page.sectionName}
        </div>
        <div
          className={css({
            ...theme.typography.ParagraphSmall,
            color: theme.colors.contentTertiary,
          })}
        >
          {page.name}
        </div>
      </div>
    </div>
  );
}

export { Page as default, getStaticPaths, getStaticProps };
