import * as THREE from 'three';
import { MyCamera } from './MyCamera';
import { MirrorCamera } from './MirrorCamera';
import { StaticLights } from './objs/StaticLights';
import { config } from '../config';
import * as Stats from 'stats.js';
import { debounce } from '../utils/debounce';
import { WaterConfig, waterFactory } from './objs/waterFactory';
import { CirclingLights } from './objs/CirclingLights';
import { Mountains } from './objs/Mountains';

export class SmartScene {
  el: HTMLCanvasElement;

  camera: MyCamera;
  cubeCamera: THREE.CubeCamera;

  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;

  water: THREE.Object3D;

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
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.el });
    renderer.setClearColor(0xaaaaaa, 0.5);
    renderer.setSize(width, height);

    return renderer;
  }

  _initSceneObjs(config: WaterConfig) {
    this.water = waterFactory(config, this.renderer, this.cubeCamera.renderTarget.texture);

    [new StaticLights(), new CirclingLights(), new Mountains(), this.water].forEach(it =>
      this.scene.add(it)
    );
  }

  _initScene() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.CubeTextureLoader()
      .setPath('skybox/')
      .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

    this.renderer = this._initRenderer(width, height);
    this.camera = new MyCamera(width / height, this.el);
    // todo to config
    this.cubeCamera = new MirrorCamera(512);

    const onResizeDebounced = debounce(() => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }, 200);

    // todo should also remove listener somewhere
    window.addEventListener('resize', onResizeDebounced, { passive: false });
  }

  _renderMirror() {
    this.water.visible = false;
    this.cubeCamera.update(this.renderer, this.scene);
    this.water.visible = true;
  }
  run = () => {
    this._renderMirror();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.run);
    this.stats && this.stats.update();
  };
}
