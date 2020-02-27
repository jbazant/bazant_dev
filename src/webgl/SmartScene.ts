import * as THREE from 'three';
import { MyCamera } from './cameras/MyCamera';
import { MirrorCamera } from './cameras/MirrorCamera';
import { StaticLights } from './objs/StaticLights';
import { config } from '../config';
import * as Stats from 'stats.js';
import { debounce } from '../utils/debounce';
import { waterFactory } from './objs/waterFactory';
import { Mountains } from './objs/Mountains';
import { firefliesFactory } from './objs/firefliesFactory';

export class SmartScene {
  el: HTMLCanvasElement;

  camera: MyCamera;
  waterMirrorCamera: MirrorCamera;

  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;

  water: THREE.Object3D;

  stats: Stats | null;

  constructor(targetEl: HTMLCanvasElement, sceneConfig: typeof config) {
    this.el = targetEl;
    this._initScene(sceneConfig);
    this._initSceneObjs(sceneConfig);

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

  _initSceneObjs(sceneConfig: typeof config) {
    this.water = waterFactory(
      sceneConfig.water,
      this.renderer,
      this.waterMirrorCamera.renderTarget.texture
    );

    this.scene.add(
      new StaticLights(),
      new Mountains(),
      this.water,
      ...firefliesFactory(config.fireflies, config.fireflyConfig)
    );
  }

  _initScene(sceneConfig: typeof config) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.CubeTextureLoader()
      .setPath('skybox/')
      .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);

    this.renderer = this._initRenderer(width, height);
    this.camera = new MyCamera(width / height, this.el);
    this.waterMirrorCamera = new MirrorCamera(sceneConfig.mirrorCameraResolution);

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
    this.waterMirrorCamera.mirrorPosition(this.camera);
    this.waterMirrorCamera.update(this.renderer, this.scene);
    this.water.visible = true;
  }

  run = () => {
    this._renderMirror();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.run);
    this.stats && this.stats.update();
  };
}
