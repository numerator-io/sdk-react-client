import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { NumeratorProvider } from "@numerator-io/sdk-react-client";
import { IntegratedNumeratorProvider } from "./providers/IntegratedNumeratorProvider";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <NumeratorProvider
      configClient={{
        baseUrl: 'https://service-platform.dev.numerator.io',
        apiKey: 'NUM.PbmFqVAzzHbUlieb1f51Fg==.5BsoRn9KBLCTMOiEmBxzX2hgEsP3raI61bXQ4dRKCXhzyzGNcyII+FWTUipNHi+E',
        pollingInterval: 5000, // 5 seconds polling to get new feature flags
      }}
      defaultContext={{}}
      loadPolling={true}>
      <IntegratedNumeratorProvider>
        <App />
      </IntegratedNumeratorProvider>
    </NumeratorProvider>
  </React.StrictMode>,
);
