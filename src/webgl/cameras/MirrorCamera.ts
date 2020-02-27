import * as THREE from 'three';

export class MirrorCamera extends THREE.CubeCamera {
  constructor(resolution: number) {
    super(0.1, 5000, resolution);
  }

  mirrorPosition(camera: THREE.Camera) {
    const v = camera.position;
    // @ts-ignore
    this.position.set(v.x, -v.y, v.z);
  }
}
