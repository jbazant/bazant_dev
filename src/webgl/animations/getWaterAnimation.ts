import { NullAnimation } from './NullAnimation';
import { SinWaves } from './SinWaves';
import { RainWaves } from './RainWaves';

export enum AnimationTypeEnum {
  Null,
  Rain,
  Sin,
}

export type animationConfig = null | {
  speed: number;
  distance: number;
  density: number;
  wavesPerSecond: number;
};

export const getWaterAnimation = (
  animationType: AnimationTypeEnum,
  segmentCount: number,
  animationConfig: animationConfig
) => new [NullAnimation, RainWaves, SinWaves][animationType](segmentCount, animationConfig);
