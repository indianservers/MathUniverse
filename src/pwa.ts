async function clearMathUniverseCaches() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map((registration) => registration.unregister()));
  }

  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("math-universe") || key.startsWith("workbox")).map((key) => caches.delete(key)));
  }
}

window.addEventListener("load", () => {
  void clearMathUniverseCaches();
});
