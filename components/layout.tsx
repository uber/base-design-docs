import Head from "next/head";
import { useStyletron, DarkThemeMove, ThemeProvider } from "baseui";
import SideNavigation from "./side-navigation";
import Header from "./header";

interface LayoutProps {
  children?: any; // TODO: fix this children type
  pages: any[];
  fileName: string;
  fileId: string;
  nodeId?: string;
}

function Layout({
  children,
  pages,
  fileName,
  fileId,
  nodeId = null,
}: LayoutProps) {
  const [css, theme] = useStyletron();
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
        <ThemeProvider theme={DarkThemeMove}>
          <Header
            fileId={fileId}
            fileName={fileName}
            nodeId={nodeId}
            pages={pages}
          />
        </ThemeProvider>
        <SideNavigation
          fileId={fileId}
          fileName={fileName}
          nodeId={nodeId}
          pages={pages}
        />
        <main
          className={css({
            marginTop: "60px",
            [theme.mediaQuery.large]: {
              marginLeft: "300px",
            },
          })}
        >
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
