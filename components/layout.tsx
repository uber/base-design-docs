import Head from "next/head";
import { useStyletron, DarkThemeMove, ThemeProvider } from "baseui";
import SideNavigation from "./side-navigation";
import Header from "./header";
import { MQ } from "../lib/constants";

interface Props {
  children?: any; // TODO: fix this children type
  pages: any[];
  fileName?: string;
  fileId?: string;
  nodeId?: string;
}

function Layout({
  children,
  pages,
  fileName = null,
  fileId = null,
  nodeId = null,
}: Props) {
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
        <ThemeProvider theme={DarkThemeMove}>
          <Header
            fileId={fileId}
            fileName={fileName}
            nodeId={nodeId}
            pages={pages}
          />
        </ThemeProvider>
        <SideNavigation nodeId={nodeId} pages={pages} />
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
      </div>
    </div>
  );
}

export default Layout;
