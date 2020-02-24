import * as THREE from 'three';
import { SimplexNoise } from '../../utils/SimplexNoise';

export class Mountains extends THREE.Group {
  segments = 32;
  noiseScale = 0.1;

  constructor() {
    super();
    const material = this._generateMaterial();
    const geometry1 = this._generateGeometry(256);
    const geometry2 = this._generateGeometry(350);
    const mesh1 = new THREE.Mesh(geometry1, material);
    mesh1.translateZ(-120);
    mesh1.rotateX(-Math.PI / 4);
    mesh1.rotateZ((Math.PI * 3) / 4);
    const mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.translateX(-120);
    mesh2.rotateX(-Math.PI / 5);
    mesh2.rotateZ(Math.PI / 5);
    mesh2.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    this.add(mesh1, mesh2);
  }

  private _getOffsetZ(x: number, y: number) {
    return 3 * (x + y * this.segments) + 2;
  }

  private _generateGeometry(size: number) {
    const geometry = new THREE.PlaneBufferGeometry(
      size,
      size,
      this.segments - 1,
      this.segments - 1
    );
    const simplex = new SimplexNoise();

    for (let i = 0; i < this.segments; ++i) {
      for (let j = 0; j < this.segments; ++j) {
        //@ts-ignore value is actually not read only
        geometry.attributes.position.array[this._getOffsetZ(i, j)] +=
          8 * simplex.noise(i * this.noiseScale, j * this.noiseScale);
      }
    }

    for (let i = 0; i < this.segments; ++i) {
      const modifier = 16;
      //@ts-ignore value is actually not read only
      geometry.attributes.position.array[this._getOffsetZ(i, 0)] -= modifier;
      //@ts-ignore value is actually not read only
      geometry.attributes.position.array[this._getOffsetZ(i, this.segments - 1)] -= modifier;
      //@ts-ignore value is actually not read only
      geometry.attributes.position.array[this._getOffsetZ(0, i)] -= modifier;
      //@ts-ignore value is actually not read only
      geometry.attributes.position.array[this._getOffsetZ(this.segments - 1, i)] -= modifier;

      //@ts-ignore value is actually not read only
      geometry.attributes.position.array[this._getOffsetZ(i, 1)] -= modifier / 2;
      //@ts-ignore value is actually not read only
      geometry.attributes.position.array[this._getOffsetZ(i, this.segments - 2)] -= modifier / 2;
      //@ts-ignore value is actually not read only
      geometry.attributes.position.array[this._getOffsetZ(1, i)] -= modifier / 2;
      //@ts-ignore value is actually not read only
      geometry.attributes.position.array[this._getOffsetZ(this.segments - 2, i)] -= modifier / 2;
    }

    geometry.computeVertexNormals();
    return geometry;
  }

  private _generateMaterial() {
    const loader = new THREE.TextureLoader();
    return new THREE.MeshPhongMaterial({
      map: loader.load('./terrain.jpg', texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(2, 2);
      }),
      normalMap: loader.load('./waternormals.jpg', texture => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
      }),
      specular: '#000',
      shininess: 0,
      emissive: '#000',
    });
  }
}
