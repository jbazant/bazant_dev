import { ready } from './utils/domHelpers';
import { initMenu } from './common/menu';
import { initContactForm } from './common/contact';
import { lazyload } from './utils/lazyload';

ready(() => {
  initMenu();
  initContactForm();
  lazyload('img.img-resp', 'https://cdn.jsdelivr.net/npm/lazysizes@5/lazysizes.min.js', true);
});
