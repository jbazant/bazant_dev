export function ga(): void {
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function gtag(...args: any[]) {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'UA-159918314-1');
}
