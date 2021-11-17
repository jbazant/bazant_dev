export function registerSW(): void {
  if (location.hostname !== 'localhost' && 'serviceWorker' in navigator) {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  }
}
