import * as THREE from 'three';
import { SimplexNoise } from '../../utils/SimplexNoise';

// todo to config / params ?
const LIGHT_COLOR = new THREE.Color('rgb(117,149,47)');
const LIGHT_INTENSITY = 0.8;
const LIGHT_DISTANCE = 200;
const BODY_COLOR = new THREE.Color('#5d3a02');

export class Firefly extends THREE.Mesh {
  clock: THREE.Clock;
  simplex: SimplexNoise;
  flyBasePosition: THREE.Vector3;
  flyPosition: THREE.Vector3;
  maxDeviation: number;

  constructor(position: THREE.Vector3, maxDeviation: number) {
    super();

    this.flyBasePosition = position;
    this.maxDeviation = maxDeviation;

    this.clock = new THREE.Clock();
    this.clock.start();
    this.simplex = new SimplexNoise();

    const model = this._getModel();
    this.flyPosition = model.position;
    this.add(model);
  }

  _getBodyPartGeometry(size: number) {
    const geometry = new THREE.SphereBufferGeometry(size);
    geometry.scale(1, 1, 2);

    return geometry;
  }

  _getModel() {
    const frontPart = new THREE.Mesh(
      this._getBodyPartGeometry(0.4),
      new THREE.MeshLambertMaterial({
        color: BODY_COLOR,
      })
    );
    frontPart.position.setZ(-0.2);

    const backPart = new THREE.Mesh(
      this._getBodyPartGeometry(0.3),
      new THREE.MeshLambertMaterial({
        transparent: true,
        color: LIGHT_COLOR,
        emissive: LIGHT_COLOR,
        emissiveIntensity: 2,
      })
    );
    backPart.rotateX(Math.PI / 5);
    backPart.position.set(0, -0.1, 0.2);

    const light = new THREE.PointLight(LIGHT_COLOR, LIGHT_INTENSITY, LIGHT_DISTANCE);

    const group = new THREE.Group();
    group.add(frontPart, backPart, light);
    this.add(group);

    return group;
  }

  _getNoise(t1: number, t2: number) {
    const positionNoise = new THREE.Vector3(
      this.simplex.noise2d(Math.cos(t1), t2),
      this.simplex.noise2d(0, t2),
      this.simplex.noise2d(Math.sin(t1), t2)
    );
    positionNoise.multiplyScalar(this.maxDeviation);

    return positionNoise;
  }

  _computePosition() {
    const t = this.clock.getElapsedTime();

    this.flyPosition.addVectors(this._getNoise(t / 2, t / 4), this.flyBasePosition);
    this.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.01);
  }

  onBeforeRender = () => {
    this._computePosition();
  };
}
