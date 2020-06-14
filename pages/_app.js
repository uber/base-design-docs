import { Provider as StyletronProvider, DebugEngine } from "styletron-react";
import { Client, Server } from "styletron-engine-monolithic";
import { BaseProvider, LightThemeMove } from "baseui";

// Styletron setup
const isServer = typeof window === "undefined";
const getHydrate = () => document.getElementsByClassName("_styletron_hydrate_");
const styletron = isServer
  ? new Server()
  : new Client({ hydrate: getHydrate() });
const debug =
  process.env.NODE_ENV === "production" ? void 0 : new DebugEngine();

function App({ Component, pageProps }) {
  return (
    <div>
      <StyletronProvider value={styletron} debug={debug} debugAfterHydration>
        <BaseProvider theme={LightThemeMove}>
          <Component {...pageProps} />
        </BaseProvider>
      </StyletronProvider>

      <style jsx global>{`
        * {
          box-sizing: border-box;
        }
        body {
          margin: 0;
        }
      `}</style>
    </div>
  );
}

export default App;
