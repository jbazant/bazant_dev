import { SmartScene } from './webgl/SmartScene';
import { getConfig } from './config';
import { getFamily } from './family';

const canvas = document.getElementById('water-canvas') as HTMLCanvasElement;
const gl = canvas && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));

if (gl && gl instanceof WebGLRenderingContext) {
  const smartScene = new SmartScene(canvas, getConfig(gl.getSupportedExtensions()));
  const getClassList = (name: string) =>
    document.getElementById(`loading-${name}-placeholder`).classList;

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

alert('it works!');
export { getFamily };
