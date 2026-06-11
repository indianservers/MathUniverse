import { App } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle } from "@capacitor/haptics";
import { Keyboard } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";

export type NativePlatform = "web" | "android" | "ios";

export function nativePlatform(): NativePlatform {
  const platform = Capacitor.getPlatform();
  return platform === "android" || platform === "ios" ? platform : "web";
}

export function isNativeShell() {
  return Capacitor.isNativePlatform();
}

export async function setupNativeBridge() {
  const platform = nativePlatform();
  document.documentElement.dataset.nativePlatform = platform;
  document.documentElement.classList.toggle("native-shell", platform !== "web");
  document.documentElement.classList.toggle("native-platform-android", platform === "android");
  document.documentElement.classList.toggle("native-platform-ios", platform === "ios");

  if (platform === "web") return;

  await Promise.allSettled([
    StatusBar.setStyle({ style: Style.Dark }),
    StatusBar.setBackgroundColor({ color: "#07111f" }),
    Keyboard.setAccessoryBarVisible({ isVisible: true }),
  ]);

  Keyboard.addListener("keyboardWillShow", () => {
    document.documentElement.classList.add("native-keyboard-open");
  });
  Keyboard.addListener("keyboardWillHide", () => {
    document.documentElement.classList.remove("native-keyboard-open");
  });
  App.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack || window.history.length > 1) {
      window.history.back();
      return;
    }
    void App.minimizeApp();
  });
}

export function nativeTapFeedback() {
  if (!isNativeShell()) return;
  void Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
}
