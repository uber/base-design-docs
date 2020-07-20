import { AppProps } from "next/app";
import Router from "next/router";
import { useEffect } from "react";
import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider, LightThemeMove } from "baseui";
import { styletron, debug } from "../lib/styletron";
import Layout from "../components/layout";
import * as gtag from "../lib/gtag";

import "../styles.css";

function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
  return (
    <div>
      <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
        <BaseProvider theme={LightThemeMove} zIndex={2}>
          <Layout {...pageProps}>
            <Component {...pageProps} />
          </Layout>
        </BaseProvider>
      </StyletronProvider>
    </div>
  );
}

export default App;
