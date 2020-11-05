import { ready } from './utils/domHelpers';
import { initMenu } from './common/menu';
import { ga } from './utils/ga';

ga();
ready(initMenu);
