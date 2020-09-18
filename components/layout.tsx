import { useEffect, createContext, useCallback, useState } from "react";
import tinykeys from "tinykeys";
import { useRouter } from "next/router";
import Head from "next/head";
import { useStyletron, ThemeProvider, styled } from "baseui";
import { darkTheme } from "../lib/theme";
import { Modal, ModalHeader, ModalBody } from "baseui/modal";
import SideNavigation from "./side-navigation";
import Header from "./header";
import { Page, Frame } from "../lib/types";
import BottomNavigation from "./bottom-navigation";

function mod(n, m) {
  return ((n % m) + m) % m;
}

const HotKey = styled("span", {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "Menlo, Consolas, sans serif",
  fontSize: "14px",
  color: "black",
  border: "solid 1px #ddd",
  borderRadius: "3px",
  width: "24px",
  height: "24px",
  background: "#f6f6f6",
});

interface Context {
  pages: Page[];
  figmaLink: string;
  activeFrame?: Frame;
  openHelpModal: () => void;
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
  const [css, theme] = useStyletron();
  const router = useRouter();
  const [helpModalIsOpen, setHelpModalState] = useState(false);

  pageProps.openHelpModal = useCallback(() => {
    setHelpModalState(true);
  }, []);

  const activeFrameKey = pageProps?.activeFrame?.key;
  const handleHorizontalArrow = useCallback(
    (event) => {
      if (
        (event.target as HTMLInputElement).id !== "search" &&
        activeFrameKey
      ) {
        const frames = [];
        let activeFrameIndex = 0;
        for (const pages of pageProps.pages) {
          for (const frame of pages.children) {
            if (activeFrameKey === frame.key) {
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
    [activeFrameKey]
  );

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      f: (event) => {
        if ((event.target as HTMLInputElement).id !== "search") {
          window.open(pageProps.figmaLink, "_blank");
        }
      },
      "Shift+?": (event) => {
        if ((event.target as HTMLInputElement).id !== "search") {
          setHelpModalState(true);
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
          <Modal
            isOpen={helpModalIsOpen}
            onClose={() => setHelpModalState(false)}
            closeable
            animate
            autoFocus
            unstable_ModalBackdropScroll
          >
            <ModalHeader>Help & Suggestions</ModalHeader>
            <ModalBody>
              <p>
                This site allows you to quickly access documentation that the
                Design Platform team maintains in Figma. Each page is a snapshot
                of one of the frames you can find in the Figma documentation
                project.
              </p>
              <p>
                Here is a list of hotkeys you can use to make navigating the
                documentation even faster:
              </p>
              <ul className={css({ listStyle: "circle" })}>
                {[
                  ["/", "Focus the search input."],
                  ["f", "Open current page's frame in Figma."],
                  ["←", "Navigate to the previous page in documentation."],
                  ["→", "Navigate to the next page in documentation."],
                  ["?", "Open the help & suggestions modal."],
                ].map(([key, description]) => (
                  <li key={key} className={css({ marginBottom: "4px" })}>
                    <HotKey $style={{ marginRight: "8px" }}>{key}</HotKey>{" "}
                    {description}
                  </li>
                ))}
              </ul>
              <p>
                Using these hotkeys, you can quickly search for the right page
                by pressing <HotKey>/</HotKey> or navigate to related pages with{" "}
                <HotKey>←</HotKey> and <HotKey>→</HotKey>. If you want to leave
                a comment or inspect further you can always open the
                corresponding frame in Figma with <HotKey>f</HotKey>.
              </p>
            </ModalBody>
          </Modal>
          <ThemeProvider theme={darkTheme}>
            <Header />
          </ThemeProvider>
          <SideNavigation />
          <main
            className={css({
              background: activeFrameKey
                ? theme.colors.backgroundSecondary
                : theme.colors.white,
              [theme.mediaQuery.medium]: {
                marginTop: "60px",
              },
              [theme.mediaQuery.large]: {
                marginLeft: "300px",
              },
            })}
          >
            {children}
          </main>
          <BottomNavigation />
        </PageContext.Provider>
      </div>
    </div>
  );
}

export default Layout;
