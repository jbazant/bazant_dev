import {BufferGeometry} from 'three';

export abstract class WaterAnimation {
  segmentCount: number;
  static timeMultiplier: number = 0.001;
  _animationConfig: {};

  constructor(segmentCount: number, animationConfig: {}) {
    this.segmentCount = segmentCount;
    this._animationConfig = animationConfig;
  }

  abstract anim(time: number): void;

  abstract applyTo(geometry: BufferGeometry): void;
}