export function ga(): void {
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    // @ts-ignore
    dataLayer.push(args);
  }
  gtag('js', new Date());
  gtag('config', 'UA-159918314-1');
}
