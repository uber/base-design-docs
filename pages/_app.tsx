import { AppProps } from "next/app";

import { Provider as StyletronProvider } from "styletron-react";
import { BaseProvider, LightThemeMove } from "baseui";

import { styletron, debug } from "../lib/styletron";
import Layout from "../components/layout";

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
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
        }
        ::selection {
          background: #276ef1;
          color: white;
        }
      `}</style>
    </div>
  );
}

export default App;
