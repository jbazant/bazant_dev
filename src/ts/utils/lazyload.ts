export function lazyload(
  selector: string,
  src: string,
  integrity: string | false,
  preferNativeLazyLoad: boolean
): void {
  const images = document.querySelectorAll(selector);
  const numImages = images.length;

  if (numImages > 0) {
    if (preferNativeLazyLoad && 'loading' in HTMLImageElement.prototype) {
      const keys = ['src', 'srcset'];

      images.forEach((image) => {
        keys.forEach((key) => {
          if (image.hasAttribute('data-' + key)) {
            image.setAttribute(key, image.getAttribute('data-' + key));
          }
        });
      });
    } else {
      const script = document.createElement('script');
      script.async = true;
      script.src = src;
      script.crossOrigin = 'anonymous';
      if (integrity) {
        script.integrity = integrity;
      }
      document.body.appendChild(script);
    }
  }
}
