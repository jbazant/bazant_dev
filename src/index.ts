import { SmartScene } from './webgl/SmartScene';
import { config } from './config';

const canvas = document.getElementById('water-canvas') as HTMLCanvasElement;
const smartScene = new SmartScene(canvas, config);

smartScene.onReady(() => {
  document.getElementById('loading-info-placeholder').remove();
  smartScene.run();
});
