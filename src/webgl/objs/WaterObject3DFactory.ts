import {
  BufferGeometry,
  CubeTexture,
  FrontSide,
  Mesh,
  MeshLambertMaterial,
  Object3D,
  Points,
  PointsMaterial,
  TextureLoader,
} from 'three';

export enum WaterTypeEnum {
  Points,
  EnvMap,
}

export const getWaterObject3DFactory = (waterType: WaterTypeEnum, skyTexture?: CubeTexture) => {
  switch (waterType) {
    case WaterTypeEnum.Points:
      return (geometry: BufferGeometry): Object3D =>
        new Points(
          geometry,
          new PointsMaterial({
            color: 0xf3ffe2,
            size: 3,
          })
        );
    case WaterTypeEnum.EnvMap:
      if (!skyTexture) {
        throw new Error('skyTexture is required');
      } else {
        const waterTexture = new TextureLoader().load('water.jpg');
        const material = new MeshLambertMaterial({
          envMap: skyTexture,
          map: waterTexture,
          opacity: 0.9,
          transparent: true,
          side: FrontSide,
        });

        return (geometry: BufferGeometry): Object3D => new Mesh(geometry, material);
      }
  }
};
