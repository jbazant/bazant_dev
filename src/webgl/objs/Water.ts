import {SmartObj} from '../general/SmartObj';
import {
  BufferGeometry,
  Float32BufferAttribute,
  Object3D,
} from 'three';
import {WaterAnimation} from '../animations/WaterAnimation';
import {NullAnimation} from '../animations/NullAnimation';

type GetObject3DCallback = (geometry: BufferGeometry) => Object3D

export class Water extends SmartObj {
  size: number;
  segments: number;
  geometry: BufferGeometry;
  waterAnimation: WaterAnimation;

  constructor(
    size: number,
    segments: number,
    getMesh: GetObject3DCallback,
    waterAnimation: WaterAnimation,
  ) {
    super(size, segments, getMesh);
    this.size = size;
    this.segments = segments;
    this.waterAnimation = waterAnimation || new NullAnimation(segments, {});
  }

  _getGeometry(size: number, segments: number) {
    const geometry = new BufferGeometry();
    const indices = [];
    const vertices = [];
    const normals = [];
    const uvs = [];
    const halfSize = size / 2;
    const segmentSize = size / segments;

    // generate vertices, normals and color data for a simple grid geometry
    for (let i = 0; i <= segments; i++) {
      const z = (i * segmentSize) - halfSize;
      for (let j = 0; j <= segments; j++) {
        const x = (j * segmentSize) - halfSize;
        vertices.push(x, 0, z);
        normals.push(0, 1, 0);
        uvs.push(i / segments, j / segments);
      }
    }
    // generate indices (data for element array buffer)
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const a = i * (segments + 1) + (j + 1);
        const b = i * (segments + 1) + j;
        const c = (i + 1) * (segments + 1) + j;
        const d = (i + 1) * (segments + 1) + (j + 1);
        // generate two faces (triangles) per iteration
        indices.push(a, b, d); // face one
        indices.push(b, c, d); // face two
      }
    }
    //
    geometry.setIndex(indices);
    geometry.addAttribute('position', new Float32BufferAttribute(vertices, 3));
    geometry.addAttribute('normal', new Float32BufferAttribute(normals, 3));
    geometry.addAttribute('uv', new Float32BufferAttribute(uvs, 2));

    return geometry;
  }

  init(size: number, segments: number, getObject3D: GetObject3DCallback) {
    this.geometry = this._getGeometry(size, segments);
    return [getObject3D(this.geometry)];
  }

  anim(time: number) {
    this.waterAnimation.anim(time);
    this.waterAnimation.applyTo(this.geometry);
  }
}