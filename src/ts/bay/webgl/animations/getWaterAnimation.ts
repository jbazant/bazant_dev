import { NullAnimation } from './NullAnimation';
import { RainWaves } from './RainWaves';
import { WebGLRenderer } from 'three';
import { WaterAnimation } from './WaterAnimation';

export enum AnimationTypeEnum {
  Null,
  Rain,
}

export const getWaterAnimation = (
  animationType: AnimationTypeEnum,
  segmentCount: number,
  renderer: WebGLRenderer
): WaterAnimation => new [NullAnimation, RainWaves][animationType](segmentCount, renderer);
