import {
  BufferGeometry,
  CubeTexture,
  Float32BufferAttribute,
  FrontSide,
  Mesh,
  MeshLambertMaterial,
  Points,
  PointsMaterial,
  TextureLoader,
} from 'three';
import {
  AnimationConfig,
  AnimationTypeEnum,
  getWaterAnimation,
} from '../animations/getWaterAnimation';

export enum WaterTypeEnum {
  Points,
  EnvMap,
  Shader,
}

export type WaterConfig = {
  segmentCount: number;
  size: number;
  waterType: WaterTypeEnum;
  animationType: AnimationTypeEnum;
  animationConfig: AnimationConfig;
};

export function getGeometry(size: number, segments: number) {
  const geometry = new BufferGeometry();
  const indices = [];
  const vertices = [];
  const normals = [];
  const uvs = [];
  const halfSize = size / 2;
  const segmentSize = size / segments;

  // generate vertices, normals and color data for a simple grid geometry
  for (let i = 0; i <= segments; i++) {
    const z = i * segmentSize - halfSize;
    for (let j = 0; j <= segments; j++) {
      const x = j * segmentSize - halfSize;
      vertices.push(x, 0, z);
      normals.push(0, 1, 0);
      uvs.push(i / segments, j / segments);
    }
  }
  // generate indices (data for element array buffer)
  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < segments; j++) {
      const a = i * (segments + 1) + (j + 1);
      const b = i * (segments + 1) + j;
      const c = (i + 1) * (segments + 1) + j;
      const d = (i + 1) * (segments + 1) + (j + 1);
      // generate two faces (triangles) per iteration
      indices.push(a, b, d); // face one
      indices.push(b, c, d); // face two
    }
  }
  //
  geometry.setIndex(indices);
  geometry.addAttribute('position', new Float32BufferAttribute(vertices, 3));
  geometry.addAttribute('normal', new Float32BufferAttribute(normals, 3));
  geometry.addAttribute('uv', new Float32BufferAttribute(uvs, 2));

  return geometry;
}

function getMaterial(waterType: WaterTypeEnum, skyTexture?: CubeTexture) {
  switch (waterType) {
    case WaterTypeEnum.Points:
      return new PointsMaterial({
        color: 0xf3ffe2,
        size: 3,
      });

    case WaterTypeEnum.EnvMap:
      if (!skyTexture) {
        throw new Error('skyTexture is required');
      } else {
        return new MeshLambertMaterial({
          envMap: skyTexture,
          map: new TextureLoader().load('water.jpg'),
          opacity: 0.95,
          transparent: true,
          side: FrontSide,
        });
      }
  }
}

function getObject3DPrototype(waterType: WaterTypeEnum) {
  return WaterTypeEnum.Points === waterType ? Points : Mesh;
}

export function waterFactory(config: WaterConfig, skyTexture?: CubeTexture) {
  const { segmentCount, size, waterType, animationType, animationConfig } = config;
  const waterAnimation = getWaterAnimation(animationType, segmentCount, animationConfig);
  const geometry = getGeometry(size, segmentCount);
  const material = getMaterial(waterType, skyTexture);
  const object3D = new (getObject3DPrototype(waterType))(geometry, material);

  object3D.onBeforeRender = () => {
    waterAnimation.anim(10);
    waterAnimation.applyTo(geometry);
  };

  return object3D;
}
