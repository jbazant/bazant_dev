import { AnimationTypeEnum } from './webgl/animations/getWaterAnimation';
import { WaterTypeEnum } from './webgl/objs/waterFactory';

export const config = {
  water: {
    segmentCount: 400,
    size: 1000,
    animationType: AnimationTypeEnum.Rain,
    waterType: WaterTypeEnum.Shader,
    animationConfig: {
      speed: 0.05,
      distance: 0.3,
      density: 0.6,
      wavesPerSecond: 1,
    },
  },
  useStats: true,
};
