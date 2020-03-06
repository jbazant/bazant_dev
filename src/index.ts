import { SmartScene } from './webgl/SmartScene';
import { getConfig } from './config';

const canvas = document.getElementById('water-canvas') as HTMLCanvasElement;
const gl = canvas && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

if (gl && gl instanceof WebGLRenderingContext) {
  const smartScene = new SmartScene(canvas, getConfig(gl.getSupportedExtensions()));
  const getClassList = (name: string) =>
    document.getElementById(`loading-${name}-placeholder`).classList;

  const onSuccess = () => {
    getClassList('info').add('no-vis');
    smartScene.run();
  };

  const onFail = () => {
    getClassList('info').add('no-vis');
    getClassList('error').remove('no-vis');
  };

  smartScene.onReady(onSuccess, onFail);
}
