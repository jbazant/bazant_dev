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
    mesh1.matrixAutoUpdate = false;
    mesh1.updateMatrix();

    const mesh2 = new THREE.Mesh(geometry2, material);
    mesh2.translateX(-120);
    mesh2.rotateX(-Math.PI / 5);
    mesh2.rotateZ(Math.PI / 5);
    mesh2.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2);
    mesh2.matrixAutoUpdate = false;
    mesh2.updateMatrix();

    this.add(mesh1, mesh2);
    this.matrixAutoUpdate = false;
    this.updateMatrix();
  }

  private _generateGeometry(size: number) {
    const geometry = new THREE.PlaneBufferGeometry(
      size,
      size,
      this.segments - 1,
      this.segments - 1
    );

    const alterZCoord = (i: number, j: number, zMod: number) => {
      const offset = 3 * (i + j * this.segments) + 2;
      //@ts-ignore value is actually not read only
      geometry.attributes.position.array[offset] += zMod;
    };

    const simplex = new SimplexNoise();
    const deviation = 8;
    const doubleDeviation = 2 * deviation;

    for (let i = 0; i < this.segments; ++i) {
      for (let j = 0; j < this.segments; ++j) {
        const zMod = deviation * simplex.noise(i * this.noiseScale, j * this.noiseScale);
        alterZCoord(i, j, zMod);
      }

      [0, this.segments - 1].forEach((j) => {
        alterZCoord(i, j, -doubleDeviation);
        alterZCoord(j, i, -doubleDeviation);
      });
      [1, this.segments - 2].forEach((j) => {
        alterZCoord(i, j, -deviation);
        alterZCoord(j, i, -deviation);
      });
    }

    geometry.computeVertexNormals();
    return geometry;
  }

  private _generateMaterial() {
    const loader = new THREE.TextureLoader().setPath('images/');
    const map = loader.load('terrain.jpg', (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(2, 2);
    });
    const normalMap = loader.load('terrain-normals.jpg', (texture) => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(1, 1);
    });

    return new THREE.MeshPhongMaterial({
      map,
      normalMap,
      specular: '#000',
      emissive: '#000',
      shininess: 0,
    });
  }
}
