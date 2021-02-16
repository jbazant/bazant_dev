import * as THREE from 'three';
import { MyCamera } from './cameras/MyCamera';
import { MirrorCamera } from './cameras/MirrorCamera';
import { StaticLights } from './objs/StaticLights';
import { ConfigType } from '../config';
import * as Stats from 'stats.js';
import { debounce } from '../../utils/debounce';
import { waterFactory } from './objs/waterFactory';
import { Mountains } from './objs/Mountains';
import { firefliesFactory } from './objs/firefliesFactory';
import { Text3d } from './objs/Text3d';

export class SmartScene {
  el: HTMLCanvasElement;
  wrapper: HTMLElement;

  aspect: number;

  camera: MyCamera;
  waterMirrorCamera: MirrorCamera;
  waterMirrorCameraTarget: THREE.WebGLCubeRenderTarget;

  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;

  water: THREE.Object3D;

  stats: Stats | null;

  constructor(targetEl: HTMLCanvasElement, wrapper: HTMLElement, sceneConfig: ConfigType) {
    this.el = targetEl;
    this.wrapper = wrapper;
    this.aspect = sceneConfig.aspect;

    this._initScene(sceneConfig);
    this._initSceneObjs(sceneConfig);

    if (sceneConfig.useStats) {
      this.stats = new Stats();
      document.body.appendChild(this.stats.dom);
    }
  }

  _updateSize = (): void => {
    const w = this.wrapper.clientWidth;
    this.renderer.setSize(w, w / this.aspect);
    //this.camera.updateProjectionMatrix();
  };

  _initRenderer(): THREE.WebGLRenderer {
    const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: this.el });
    renderer.setClearColor(0x1e0e25, 0.5);

    return renderer;
  }

  _initSceneObjs(sceneConfig: ConfigType): void {
    this.water = waterFactory(
      sceneConfig.water,
      this.renderer,
      this.waterMirrorCameraTarget.texture
    );

    this.scene.add(
      new StaticLights(),
      new Mountains(),
      this.water,
      new Text3d(sceneConfig.text3d.lines),
      ...firefliesFactory(sceneConfig.fireflies, sceneConfig.fireflyConfig)
    );
  }

  _initScene(sceneConfig: ConfigType): void {
    //const textures = ['px', 'nx', 'py', 'ny', 'pz', 'nz'];
    const textures = ['px', 'px', 'py', 'py', 'nz', 'nz'];

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.CubeTextureLoader()
      .setPath('/images/gl_bay/skybox/')
      .load(textures.map((it) => `${it}.png`));

    this.renderer = this._initRenderer();
    this.camera = new MyCamera(this.aspect, this.el, sceneConfig.camera);
    this.waterMirrorCameraTarget = new THREE.WebGLCubeRenderTarget(
      sceneConfig.mirrorCamera.resolution,
      {
        format: THREE.RGBFormat,
        generateMipmaps: true,
        minFilter: THREE.LinearMipmapLinearFilter,
      }
    );
    this.waterMirrorCamera = new MirrorCamera(this.waterMirrorCameraTarget);
  }

  _renderMirror(): void {
    this.water.visible = false;
    this.waterMirrorCamera.mirrorPosition(this.camera);
    this.waterMirrorCamera.update(this.renderer, this.scene);
    this.water.visible = true;
  }

  onReady(onSuccess: () => void, onFail: () => void): void {
    THREE.DefaultLoadingManager.onLoad = onSuccess;
    THREE.DefaultLoadingManager.onError = onFail;

    this._updateSize();
    const onResizeDebounced = debounce(this._updateSize, 200);

    // todo should also remove listener somewhere
    window.addEventListener('resize', onResizeDebounced, { passive: false });
  }

  run = (): void => {
    this._renderMirror();
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.run);
    this.stats && this.stats.update();
  };
}
