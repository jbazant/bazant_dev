import { ready } from './utils/domHelpers';
import { initMenu } from './common/menu';
import { initContactForm } from './common/contact';
import { lazyload } from './utils/lazyload';
import { ga } from './utils/ga';
import { initTransitions } from './common/transitions';
import { registerSW } from './service-worker/registerSW';

ga();
initTransitions('.scroll-transition');
registerSW();

ready(() => {
  initMenu();
  initContactForm();
  lazyload(
    'img.img-resp',
    'https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js',
    'sha384-1N8YjIsNRRCGVDKyAhuzcypn/egF8x3HYOojJWpxKhYt/YbyYLefKrQJBGSRopcw',
    true
  );
});
