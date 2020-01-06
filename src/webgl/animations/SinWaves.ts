import { WaterAnimation } from './WaterAnimation';
import { BufferGeometry } from 'three';

export class SinWaves extends WaterAnimation {
  time = 0;

  anim(time: number) {
    this.time = time;
  }

  applyTo(geometry: BufferGeometry) {
    // @ts-ignore
    geometry.attributes.position.needsUpdate = true;
    for (let i = 0; i <= this.segmentCount; i++) {
      const y = Math.sin(i / 5 + this.time * WaterAnimation.timeMultiplier) * 5;
      for (let j = 0; j <= this.segmentCount; j++) {
        const index = 3 * (i + j * (this.segmentCount + 1)) + 1;
        // @ts-ignore
        geometry.attributes.position.array[index] = y;
      }
    }
    geometry.computeVertexNormals();
  }
}
