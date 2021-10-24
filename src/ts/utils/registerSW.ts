export function registerSW(): void {
  // TODO PWA disable service worker locally when ready
  //if (location.hostname !== 'localhost' && 'serviceWorker' in navigator) {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
  }
}
