import { NullAnimation } from './NullAnimation';
import { RainWaves } from './RainWaves';
import { WebGLRenderer } from 'three';

export enum AnimationTypeEnum {
  Null,
  Rain,
}

export type AnimationConfig = null | {
  speed: number;
  distance: number;
  density: number;
  wavesPerSecond: number;
};

export const getWaterAnimation = (
  animationType: AnimationTypeEnum,
  segmentCount: number,
  renderer: WebGLRenderer
) => new [NullAnimation, RainWaves][animationType](segmentCount, renderer);
