import React from "react";
import ReactDOM from "react-dom/client";
import { Offline, Online } from "react-detect-offline";

import App from "./components/app/app";
import "./main.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Online>
      <App />
    </Online>
    <Offline>
      <span className="offline">Something bad happened to your Internet</span>
    </Offline>
  </React.StrictMode>
);
