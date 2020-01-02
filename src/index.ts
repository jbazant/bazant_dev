import {SmartScene} from './webgl/SmartScene';
import {config} from './config';

const canvas = document.getElementById('c') as HTMLCanvasElement;
const a = new SmartScene(canvas, config);
a.run(0);
