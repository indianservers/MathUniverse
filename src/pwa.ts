async function clearMathUniverseCaches() {
  if ("serviceWorker" in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.filter(registration=>registration.active?.scriptURL.endsWith("/sw.js")).map((registration) => registration.unregister()));
  }

  if ("caches" in window) {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("math-universe") || key.startsWith("workbox")).map((key) => caches.delete(key)));
  }
}

window.addEventListener("load", () => {
  void clearMathUniverseCaches().then(async()=>{if(import.meta.env.PROD&&'serviceWorker' in navigator&&window.isSecureContext){try{await navigator.serviceWorker.register(import.meta.env.BASE_URL+'ruhi-offline-sw.js',{scope:import.meta.env.BASE_URL,updateViaCache:'none'});}catch(error){console.warn('Offline installation did not complete:',error);}}});
});
