import { createContext } from "react";
import Head from "next/head";
import { useStyletron, DarkThemeMove, ThemeProvider } from "baseui";
import SideNavigation from "./side-navigation";
import Header from "./header";
import { MQ } from "../lib/constants";
import { Page, Frame } from "../lib/types";

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
