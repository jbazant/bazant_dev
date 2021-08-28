import { ready } from './utils/domHelpers';
import { initMenu } from './common/menu';
import { ga } from './utils/ga';
import { registerSW } from './service-worker/registerSW';

ga();
registerSW();
ready(initMenu);
