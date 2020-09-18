import { useEffect, createContext, useCallback } from "react";
import tinykeys from "tinykeys";
import { useRouter } from "next/router";
import Head from "next/head";
import { useStyletron, DarkThemeMove, ThemeProvider } from "baseui";
import SideNavigation from "./side-navigation";
import Header from "./header";
import { MQ } from "../lib/constants";
import { Page, Frame } from "../lib/types";

function mod(n, m) {
  return ((n % m) + m) % m;
}

interface Context {
  pages: Page[];
  figmaLink: string;
  activeFrame?: Frame;
}

export const PageContext = createContext({
  pages: [],
  figmaLink: "",
  activeFrame: {},
} as Context);

interface Props extends Context {
  children?: React.ReactNode;
}

function Layout({ children, ...pageProps }: Props) {
  const [css] = useStyletron();
  const router = useRouter();

  const handleHorizontalArrow = useCallback(
    (event) => {
      if (
        (event.target as HTMLInputElement).id !== "search" &&
        pageProps.activeFrame.key
      ) {
        const frames = [];
        let activeFrameIndex = 0;
        for (const pages of pageProps.pages) {
          for (const frame of pages.children) {
            if (pageProps.activeFrame.key === frame.key) {
              activeFrameIndex = frames.length;
            }
            frames.push(frame);
          }
        }
        const nextFrameIndex = mod(
          activeFrameIndex + (event.key === "ArrowLeft" ? -1 : 1),
          frames.length
        );
        router.push("/[frameKey]", `/${frames[nextFrameIndex].key}`);
      }
    },
    [pageProps.activeFrame.key]
  );

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      f: (event) => {
        if ((event.target as HTMLInputElement).id !== "search") {
          window.open(pageProps.figmaLink, "_blank");
        }
      },
      ArrowLeft: handleHorizontalArrow,
      ArrowRight: handleHorizontalArrow,
    });
    return () => {
      unsubscribe();
    };
  }, [pageProps.figmaLink]);

  return (
    <div>
      <Head>
        <title>Base Documentation</title>
        <meta
          name="description"
          content="A reference for both high-level patterns as well as
                component specific guidelines when using the Base design system."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/base.svg" />
      </Head>
      <div>
        <PageContext.Provider value={pageProps}>
          <ThemeProvider theme={DarkThemeMove}>
            <Header />
          </ThemeProvider>
          <SideNavigation />
          <main
            className={css({
              background: pageProps.activeFrame.key ? "#F6F6F6" : "#FFF",
              [MQ.medium]: {
                marginTop: "60px",
              },
              [MQ.large]: {
                marginLeft: "300px",
              },
            })}
          >
            {children}
          </main>
        </PageContext.Provider>
      </div>
    </div>
  );
}

export default Layout;
