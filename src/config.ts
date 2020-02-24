import { AnimationTypeEnum } from './webgl/animations/getWaterAnimation';
import { WaterTypeEnum } from './webgl/objs/waterFactory';

export const config = {
  water: {
    segmentCount: 512,
    size: 258,
    animationType: AnimationTypeEnum.Rain,
    waterType: WaterTypeEnum.CustomShader,
    animationConfig: {
      speed: 0.05,
      distance: 0.3,
      density: 0.6,
    },
  },
  useStats: true,
};
