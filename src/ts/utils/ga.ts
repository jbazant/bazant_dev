window.gtag = function (): void {
  // @ts-ignore
  // eslint-disable-next-line prefer-rest-params
  window.dataLayer.push(arguments);
};

export function ga(): void {
  // @ts-ignore
  window.dataLayer = window.dataLayer || [];

  gtag('js', new Date());
  gtag('config', 'UA-159918314-1');
}
