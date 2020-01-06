import { CubeTexture, CubeTextureLoader, Renderer, Scene, WebGLRenderer } from 'three';
import { MyCamera } from './MyCamera';
import { StaticLights } from './StaticLights';
import { SmartObj } from './general/SmartObj';
import { Water } from './objs/Water';
import { getWaterObject3DFactory } from './objs/WaterObject3DFactory';
import { getWaterAnimation } from './animations/getWaterAnimation';
import { config } from '../config';
import * as Stats from 'stats.js';
import { debounce } from '../utils/debounce';
import { CirclingLights } from './objs/CirclingLights';

export class SmartScene {
  el: HTMLCanvasElement;

  camera: MyCamera;

  scene: Scene;
  renderer: Renderer;

  skyTexture: CubeTexture;

  animableObjects: Array<SmartObj> = [];
  staticObjects: Array<SmartObj> = [];

  stats: Stats | null;

  constructor(targetEl: HTMLCanvasElement, sceneConfig: typeof config) {
    this.el = targetEl;
    this._initScene();
    this._initSceneObjs(sceneConfig.water);

    if (sceneConfig.useStats) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }
  }

  _addToCallback = (it: SmartObj) => it.addTo(this.scene);

  _addToMapper = (arr: Array<SmartObj>) => arr.forEach(this._addToCallback);

  _initRenderer(width: number, height: number) {
    const renderer = new WebGLRenderer({ antialias: true, canvas: this.el });
    renderer.setClearColor(0xaaaaaa, 0.5);
    renderer.setSize(width, height);

    return renderer;
  }

  _initSceneObjs(waterConfig: typeof config.water) {
    const waterAnimation = getWaterAnimation(
      waterConfig.animationType,
      waterConfig.segmentCount,
      waterConfig.animationConfig
    );
    const getObject3D = getWaterObject3DFactory(waterConfig.waterType, this.skyTexture);

    this.staticObjects = [
      new StaticLights(),
      //new Bedrock(1000)
    ];

    this.animableObjects = [
      new Water(waterConfig.size, waterConfig.segmentCount, getObject3D, waterAnimation),
      new CirclingLights(),
    ];

    this._addToMapper(this.staticObjects);
    this._addToMapper(this.animableObjects);

    //this.scene.add(new AxesHelper(1000));
  }

  _initScene() {
    // todo react to window size changes debounced
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new Scene();
    this.skyTexture = new CubeTextureLoader().load([
      'px.png',
      'nx.png',
      'py.png',
      'ny.png',
      'pz.png',
      'nz.png',
    ]);
    this.scene.background = this.skyTexture;
    this.renderer = this._initRenderer(width, height);
    this.camera = new MyCamera(width / height);

    const onResizeDebounced = debounce(() => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, 200);

    // todo should also remove listener somewhere
    window.addEventListener('resize', onResizeDebounced, false);
  }

  run = (time: number) => {
    this.stats && this.stats.begin();
    this.animableObjects.forEach(it => it.anim(time));
    this.renderer.render(this.scene, this.camera.camera);
    this.stats && this.stats.end();
    requestAnimationFrame(this.run);
  };
}
