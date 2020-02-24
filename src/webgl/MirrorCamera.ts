import * as THREE from 'three';

export class MirrorCamera extends THREE.CubeCamera {
  constructor(resolution: number) {
    super(0.1, 5000, resolution);
    this.position.set(0, -10, 0);
  }
}
