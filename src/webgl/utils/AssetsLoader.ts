import * as THREE from 'three';

class AssetsLoader {
  fontLoader: THREE.FontLoader = new THREE.FontLoader();
  textureLoader: THREE.TextureLoader = new THREE.TextureLoader();
  cubeTextureLoader: THREE.CubeTextureLoader = new THREE.CubeTextureLoader();

  inProgressCount = 0;
  progressPromise = Promise.resolve();

  _resolver: () => void;

  _onLoad = <T>(onLoad?: (response: T) => void) => (response: T) => {
    --this.inProgressCount;
    if (this.inProgressCount === 0) {
      this._resolver();
    }
    onLoad && onLoad(response);
  };

  _beforeLoad() {
    if (this.inProgressCount === 0) {
      // todo reject after timeout?
      this.progressPromise = new Promise(resolve => (this._resolver = resolve));
    }
    ++this.inProgressCount;
  }

  loadFont(
    url: string,
    onLoad?: (responseFont: THREE.Font) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    this._beforeLoad();
    return this.fontLoader.load(url, this._onLoad(onLoad), undefined, onError);
  }

  loadTexture(
    url: string,
    onLoad?: (responseFont: THREE.Texture) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    this._beforeLoad();
    return this.textureLoader.load(url, this._onLoad(onLoad), undefined, onError);
  }

  loadCubeTexture(
    urls: Array<string>,
    onLoad?: (responseFont: THREE.CubeTexture) => void,
    onError?: (event: ErrorEvent) => void
  ) {
    this._beforeLoad();
    return this.cubeTextureLoader.load(urls, this._onLoad(onLoad), undefined, onError);
  }
}

export const assetsLoaderSingleton = new AssetsLoader();
