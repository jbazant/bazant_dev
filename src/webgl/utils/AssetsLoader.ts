import * as THREE from 'three';

const TIMEOUT = 20e3;

/*
 * Note that this loader is not gold hammer.
 * If your use case is that you load one image and after some time another one
 * it can lead to problems using this loader as you get "random" rejections from `progressPromise`
 */
class AssetsLoader {
  fontLoader: THREE.FontLoader;
  textureLoader: THREE.TextureLoader;
  cubeTextureLoader: THREE.CubeTextureLoader;

  inProgressCount = 0;
  progressPromise = Promise.resolve();

  _progressTimeout: NodeJS.Timeout | null = null;
  _progressResolve: () => void;

  constructor() {
    this.fontLoader = new THREE.FontLoader();
    this.textureLoader = new THREE.TextureLoader();
    this.cubeTextureLoader = new THREE.CubeTextureLoader();

    this.fontLoader.setPath('fonts/');
    this.textureLoader.setPath('images/');
    this.cubeTextureLoader.setPath('images/');
  }

  _beforeLoad() {
    if (this.inProgressCount === 0) {
      this.progressPromise = new Promise((resolve, reject) => {
        this._progressResolve = resolve;
        this._progressTimeout = setTimeout(reject, TIMEOUT);
      });
    }

    ++this.inProgressCount;
  }

  _afterLoad = <T>(onLoad?: (response: T) => void) => (response: T) => {
    --this.inProgressCount;

    if (this.inProgressCount === 0) {
      clearTimeout(this._progressTimeout);
      this._progressResolve();
    }

    onLoad && onLoad(response);
  };

  loadFont(
    url: string,
    onLoad?: (responseFont: THREE.Font) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    this._beforeLoad();
    return this.fontLoader.load(url, this._afterLoad(onLoad), undefined, onError);
  }

  loadTexture(
    url: string,
    onLoad?: (responseFont: THREE.Texture) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    this._beforeLoad();
    return this.textureLoader.load(url, this._afterLoad(onLoad), undefined, onError);
  }

  loadCubeTexture(
    urls: Array<string>,
    onLoad?: (responseFont: THREE.CubeTexture) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    this._beforeLoad();
    return this.cubeTextureLoader.load(urls, this._afterLoad(onLoad), undefined, onError);
  }
}

export const assetsLoaderSingleton = new AssetsLoader();
