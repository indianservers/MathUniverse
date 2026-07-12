import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./pwa";
import { getRouterBasename } from "./utils/deploymentBase";

document.documentElement.dataset.nativePlatform = "web";
document.documentElement.classList.remove("native-shell", "native-platform-android", "native-platform-ios");

if ((window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.()) {
  void import("./mobile/nativeBridge").then(({ setupNativeBridge }) => setupNativeBridge());
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={getRouterBasename(window.location.pathname)}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

