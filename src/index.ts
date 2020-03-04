import { SmartScene } from './webgl/SmartScene';
import { config } from './config';

const canvas = document.getElementById('water-canvas') as HTMLCanvasElement;
const smartScene = new SmartScene(canvas, config);

const onSuccess = () => {
  document.getElementById('loading-info-placeholder').classList.add('no-vis');
  smartScene.run();
};

const onFail = () => {
  document.getElementById('loading-info-placeholder').classList.add('no-vis');
  document.getElementById('loading-error-placeholder').classList.remove('no-vis');
};

smartScene.onReady(onSuccess, onFail);
