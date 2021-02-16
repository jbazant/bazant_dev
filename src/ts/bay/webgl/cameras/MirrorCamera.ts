import * as THREE from 'three';

export class MirrorCamera extends THREE.CubeCamera {
  constructor(renderTarget: THREE.WebGLCubeRenderTarget) {
    super(0.1, 5000, renderTarget);
  }

  mirrorPosition(camera: THREE.Camera): void {
    const v = camera.position;
    // @ts-ignore
    this.position.set(v.x, -v.y, v.z);
  }
}
