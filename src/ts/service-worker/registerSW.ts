export function registerSW() {
  if (location.hostname !== 'localhost' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}
