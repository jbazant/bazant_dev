import { getFamily } from './family';
import { ready } from './utils/domHelpers';
import { initMenu } from './common/menu';
import { initContactForm } from './common/contact';

ready(initMenu);
ready(initContactForm);
export { getFamily };
