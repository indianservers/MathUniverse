import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./workspace/mobile/mobileWorkspace.css";
import "./styles/legacyDarkTheme.generated.css";
import "./styles/appTheme.css";
import "./pwa";
import { getRouterBasename } from "./utils/deploymentBase";

// Apply the saved theme before the first render to avoid a light-mode flash.
try {
  const savedTheme = JSON.parse(localStorage.getItem("math-universe-theme") ?? '"light"');
  document.documentElement.classList.toggle("dark", savedTheme === "dark");
  document.documentElement.classList.toggle("high-contrast", savedTheme === "high-contrast");
} catch {
  // The theme hook supplies the default when storage is unavailable.
}
document.documentElement.dataset.nativePlatform = "web";
document.documentElement.classList.remove(
  "native-shell",
  "native-platform-android",
  "native-platform-ios",
);

if (
  (
    window as Window & { Capacitor?: { isNativePlatform?: () => boolean } }
  ).Capacitor?.isNativePlatform?.()
) {
  void import("./mobile/nativeBridge").then(({ setupNativeBridge }) =>
    setupNativeBridge(),
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter basename={getRouterBasename(window.location.pathname)}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

import "./workspace/studioTheme.css";
