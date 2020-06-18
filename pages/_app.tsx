import { AppProps } from "next/app";

import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider, LightThemeMove } from "baseui";

import { styletron, debug } from "../lib/styletron";
import Layout from "../components/layout";

import "../styles.css";

function App({ Component, pageProps }: AppProps) {
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
