import { AnimationTypeEnum } from './webgl/animations/getWaterAnimation';
import { WaterTypeEnum } from './webgl/objs/waterFactory';

export const config = {
  water: {
    segmentCount: 512,
    size: 258,
    animationType: AnimationTypeEnum.Rain,
    waterType: WaterTypeEnum.CustomShader,
  },
  useStats: true,
  mirrorCameraResolution: 512,
  fireflyConfig: {
    light: {
      color: 'rgb(117,149,47)',
      intensity: 0.8,
      distance: 200,
    },
    body: {
      color: '#5d3a02',
    },
  },
  fireflies: [
    {
      offset: { x: 60, y: 30, z: 0 },
      maxDeviation: 20,
    },
  ],
};
