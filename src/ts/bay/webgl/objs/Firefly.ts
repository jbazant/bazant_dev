import * as THREE from 'three';
import { SimplexNoise } from '../../../utils/SimplexNoise';

export type FireflyConfig = {
  light: {
    color: string;
    intensity: number;
    distance: number;
  };
  body: {
    color: string;
  };
};

export class Firefly extends THREE.Mesh {
  clock: THREE.Clock;
  simplex: SimplexNoise;
  flyBasePosition: THREE.Vector3;
  flyPosition: THREE.Vector3;
  maxDeviation: number;

  constructor(position: THREE.Vector3, maxDeviation: number, config: FireflyConfig) {
    super();

    this.flyBasePosition = position;
    this.maxDeviation = maxDeviation;

    this.clock = new THREE.Clock(true);
    this.simplex = new SimplexNoise();

    const model = this._getModel(config);
    this.flyPosition = model.position;
    this.add(model);
  }

  _getBodyPartGeometry(size: number): THREE.BufferGeometry {
    const geometry = new THREE.SphereBufferGeometry(size);
    geometry.scale(1, 1, 2);

    return geometry;
  }

  _getModel(config: FireflyConfig): THREE.Object3D {
    const frontPart = new THREE.Mesh(
      this._getBodyPartGeometry(0.4),
      new THREE.MeshLambertMaterial({
        color: config.body.color,
      })
    );
    frontPart.position.setZ(-0.2);

    const backPart = new THREE.Mesh(
      this._getBodyPartGeometry(0.3),
      new THREE.MeshLambertMaterial({
        transparent: true,
        color: config.light.color,
        emissive: config.light.color,
        emissiveIntensity: 2,
      })
    );
    backPart.rotateX(Math.PI / 5);
    backPart.position.set(0, -0.1, 0.2);

    const light = new THREE.PointLight(
      config.light.color,
      config.light.intensity,
      config.light.distance
    );

    const group = new THREE.Group();
    group.add(frontPart, backPart, light);
    this.add(group);

    return group;
  }

  _getNoise(t1: number, t2: number): THREE.Vector3 {
    const positionNoise = new THREE.Vector3(
      this.simplex.noise2d(Math.cos(t1), t2),
      this.simplex.noise2d(0, t2),
      this.simplex.noise2d(Math.sin(t1), t2)
    );
    positionNoise.multiplyScalar(this.maxDeviation);

    return positionNoise;
  }

  _computePosition(): void {
    const d = this.clock.getDelta();
    const t = this.clock.getElapsedTime();

    this.flyPosition.addVectors(this._getNoise(t / 2, t / 4), this.flyBasePosition);
    this.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.6 * d);
  }

  onBeforeRender = (): void => {
    this._computePosition();
  };
}
