import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { NumeratorProvider } from "@numerator-io/sdk-react-client";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <NumeratorProvider
      configClient={{
        baseUrl: "https://service-platform.dev.numerator.io",
        apiKey:
          "NUM.92ccZehk596oY6Sk6W2L6Q==.gTlTQn6rHBPydazN+V/7FKslOVKWsSvIny/BkhMd9svb11k4n3WUK7UuTLNwGwVo",
        pollingInterval: 5000, // 5 seconds polling to get new feature flags
      }}
      defaultContext={{}}
    >
      <App />
    </NumeratorProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
