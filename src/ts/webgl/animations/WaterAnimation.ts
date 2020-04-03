import { Object3D, Renderer } from 'three';

export abstract class WaterAnimation {
  segmentCount: number;
  renderer: Renderer;

  constructor(segmentCount: number, renderer: Renderer) {
    this.segmentCount = segmentCount;
    this.renderer = renderer;
  }

  abstract startAnim(): void;
  abstract stopAnim(): void;

  abstract applyTo(object: Object3D): void;
}
