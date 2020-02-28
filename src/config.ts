import { AnimationTypeEnum } from './webgl/animations/getWaterAnimation';
import { WaterTypeEnum } from './webgl/objs/waterFactory';

export const config = {
  useStats: false,
  water: {
    segmentCount: 512,
    size: 258,
    animationType: AnimationTypeEnum.Rain,
    waterType: WaterTypeEnum.CustomShader,
  },
  fireflyConfig: {
    light: {
      color: 'rgb(117,149,47)',
      intensity: 2,
      distance: 100,
    },
    body: {
      color: '#5d3a02',
    },
  },
  fireflies: [
    {
      offset: { x: -10, y: 31, z: 0 },
      maxDeviation: 30,
    },
    {
      offset: { x: 70, y: 40, z: 0 },
      maxDeviation: 20,
    },
  ],
  text3d: {
    lines: ['Bažant.DEV', 'coming soon...'],
  },
  camera: {
    allowOrbitControls: false,
  },
  mirrorCamera: {
    resolution: 512,
  },
};
