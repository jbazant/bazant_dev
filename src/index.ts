import { SmartScene } from './webgl/SmartScene';
import { config } from './config';

const canvas = document.getElementById('c') as HTMLCanvasElement;
const smartScene = new SmartScene(canvas, config);
smartScene.run();
