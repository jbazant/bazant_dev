import {NullAnimation} from './NullAnimation';
import {SinWaves} from './SinWaves';
import {RainWaves} from './RainWaves';
import {config} from '../../config';

export enum AnimationTypeEnum {
  Null,
  Rain,
  Sin,
}

export const getWaterAnimation = (animationType: AnimationTypeEnum, segmentCount: number, animationConfig: typeof config.water.animationConfig) => (
  new ([
    NullAnimation,
    RainWaves,
    SinWaves,
  ][animationType])(segmentCount, animationConfig)
);
