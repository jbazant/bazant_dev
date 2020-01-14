import { CubeTexture, CubeTextureLoader, Renderer, Scene, WebGLRenderer, AxesHelper } from 'three';
import { MyCamera } from './MyCamera';
import { StaticLights } from './StaticLights';
import { config } from '../config';
import * as Stats from 'stats.js';
import { debounce } from '../utils/debounce';
import { CirclingLights } from './objs/CirclingLights';
import { Bedrock } from './objs/Bedrock';
import { WaterConfig, waterFactory } from './objs/waterFactory';
//import { getTestMeshWithShader } from './objs/ShaderTest';

export class SmartScene {
  el: HTMLCanvasElement;

  camera: MyCamera;

  scene: Scene;
  renderer: Renderer;

  skyTexture: CubeTexture;
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

  _initRenderer(width: number, height: number) {
    const renderer = new WebGLRenderer({ antialias: true, canvas: this.el });
    renderer.setClearColor(0xaaaaaa, 0.5);
    renderer.setSize(width, height);

    return renderer;
  }

  _initSceneObjs(config: WaterConfig) {
    [
      //getTestMeshWithShader(),
      new StaticLights(),
      new CirclingLights(),
      new Bedrock(1000),
      waterFactory(config, this.skyTexture),
      new AxesHelper(100),
    ].forEach(it => this.scene.add(it));
  }

  _initScene() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new Scene();
    this.skyTexture = new CubeTextureLoader()
      .setPath('skybox/')
      .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
    this.scene.background = this.skyTexture;

    this.renderer = this._initRenderer(width, height);
    this.camera = new MyCamera(width / height, this.el);

    const onResizeDebounced = debounce(() => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, 200);

    // todo should also remove listener somewhere
    window.addEventListener('resize', onResizeDebounced, { passive: false });
  }

  run = () => {
    this.stats && this.stats.begin();
    this.renderer.render(this.scene, this.camera);
    this.stats && this.stats.end();
    requestAnimationFrame(this.run);
  };
}
