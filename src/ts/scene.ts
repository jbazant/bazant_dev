import { SmartScene } from './bay/webgl/SmartScene';
import { getConfig } from './bay/config';

const canvas = document.getElementById('water-canvas') as HTMLCanvasElement;
const wrapper = document.getElementById('animation-wrapper') as HTMLDivElement;
const gl = canvas && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

if (gl && gl instanceof WebGLRenderingContext) {
  const smartScene = new SmartScene(canvas, wrapper, getConfig(gl.getSupportedExtensions()));
  const getClassList = (name: string) =>
    document.getElementById(`loading-${name}-placeholder`).classList;

  getClassList('info').remove('no-vis');

  let loadedSuccessfuly = true;
  const onSuccess = () => {
    if (loadedSuccessfuly) {
      getClassList('info').add('no-vis');
      smartScene.run();
    }
  };

  const onFail = () => {
    loadedSuccessfuly = false;
    getClassList('info').add('no-vis');
    getClassList('error').remove('no-vis');
  };

  smartScene.onReady(onSuccess, onFail);
}
