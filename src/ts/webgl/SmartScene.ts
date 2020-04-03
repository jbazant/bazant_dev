import * as THREE from 'three';
import { MyCamera } from './cameras/MyCamera';
import { MirrorCamera } from './cameras/MirrorCamera';
import { StaticLights } from './objs/StaticLights';
import { ConfigType } from '../config';
import * as Stats from 'stats.js';
import { debounce } from '../utils/debounce';
import { waterFactory } from './objs/waterFactory';
import { Mountains } from './objs/Mountains';
import { firefliesFactory } from './objs/firefliesFactory';
import { Text3d } from './objs/Text3d';

export class SmartScene {
  el: HTMLCanvasElement;

  camera: MyCamera;
  waterMirrorCamera: MirrorCamera;

  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;

  water: THREE.Object3D;

  stats: Stats | null;

  constructor(targetEl: HTMLCanvasElement, sceneConfig: ConfigType) {
    this.el = targetEl;
    this._initScene(sceneConfig);
    this._initSceneObjs(sceneConfig);

    if (sceneConfig.useStats) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }
  }

  _updateRatio = () => {
    const fullScreenRatio = window.innerWidth / window.innerHeight;

    if (fullScreenRatio < 1) {
      this.camera.aspect = 1;
      this.renderer.setSize(window.innerWidth, window.innerWidth);
    } else if (fullScreenRatio > 2.5) {
      this.camera.aspect = 2.5;
      this.renderer.setSize(2.5 * window.innerHeight, window.innerHeight);
    } else {
      this.camera.aspect = fullScreenRatio;
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    this.camera.updateProjectionMatrix();
  };

  _initRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.el });
    renderer.setClearColor(0x1e0e25, 0.5);

    return renderer;
  }

  _initSceneObjs(sceneConfig: ConfigType) {
    this.water = waterFactory(
      sceneConfig.water,
      this.renderer,
      this.waterMirrorCamera.renderTarget.texture
    );

    this.scene.add(
      new StaticLights(),
      new Mountains(),
      this.water,
      new Text3d(sceneConfig.text3d.lines),
      ...firefliesFactory(sceneConfig.fireflies, sceneConfig.fireflyConfig)
    );
  }

  _initScene(sceneConfig: ConfigType) {
    //const textures = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
    const textures = ['px', 'px', 'py', 'py', 'nz', 'nz'];

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.CubeTextureLoader()
      .setPath('images/skybox/')
      .load(textures.map(it => `${it}.png`));

    this.renderer = this._initRenderer();
    this.camera = new MyCamera(1, this.el, sceneConfig.camera);
    this.waterMirrorCamera = new MirrorCamera(sceneConfig.mirrorCamera);
  }

  _renderMirror() {
    this.water.visible = false;
    this.waterMirrorCamera.mirrorPosition(this.camera);
    this.waterMirrorCamera.update(this.renderer, this.scene);
    this.water.visible = true;
  }

  onReady(onSuccess: () => void, onFail: () => void) {
    THREE.DefaultLoadingManager.onLoad = onSuccess;
    THREE.DefaultLoadingManager.onError = onFail;

    this._updateRatio();
    const onResizeDebounced = debounce(this._updateRatio, 200);

    // todo should also remove listener somewhere
    window.addEventListener('resize', onResizeDebounced, { passive: false });
  }

  run = () => {
    this._renderMirror();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.run);
    this.stats && this.stats.update();
  };
}
