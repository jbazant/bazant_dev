import {AnimationTypeEnum} from './webgl/animations/getWaterAnimation';
import {WaterTypeEnum} from './webgl/objs/WaterObject3DFactory';

export const config = {
  water: {
    segmentCount: 500,
    size: 1000,
    animationType: AnimationTypeEnum.Rain,
    waterType: WaterTypeEnum.EnvMap,
    animationConfig: {
      speed: 0.05,
      distance: 0.3,
      density: 0.5,
      wavesPerSecond: 10,
    },
  },
  useStats: true,
};
