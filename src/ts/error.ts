import { ready } from './utils/domHelpers';
import { initMenu } from './common/menu';
import { registerSW } from './utils/registerSW';

registerSW();
ready(initMenu);
