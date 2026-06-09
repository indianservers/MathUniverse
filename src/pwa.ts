import { registerSW } from "virtual:pwa-register";

const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    void updateSW(true);
  },
  onRegisteredSW(_swUrl, registration) {
    if (!registration) return;

    setInterval(
      () => {
        void registration.update();
      },
      60 * 60 * 1000,
    );
  },
});
