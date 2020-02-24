import * as THREE from 'three';
import {
  AnimationConfig,
  AnimationTypeEnum,
  getWaterAnimation,
} from '../animations/getWaterAnimation';
import { Options, ThreeExampleShaderWater } from './ThreeExampleShaderWater';
import waterVertexShader from '../../shaders/heightmap_phong.vert';

export enum WaterTypeEnum {
  Points,
  EnvMap,
  ThreeExampleShader,
  CustomShader,
}

export type WaterConfig = {
  segmentCount: number;
  size: number;
  waterType: WaterTypeEnum;
  animationType: AnimationTypeEnum;
  animationConfig: AnimationConfig;
};

export function getGeometry(size: number, segments: number) {
  return new THREE.PlaneBufferGeometry(size, size, segments - 1, segments - 1);
}

function getMaterial(
  waterType: WaterTypeEnum,
  size: number,
  segments: number,
  envMap?: THREE.CubeTexture | THREE.Texture
) {
  switch (waterType) {
    case WaterTypeEnum.Points:
      return new THREE.PointsMaterial({
        color: 0xf3ffe2,
        size: 3,
      });

    case WaterTypeEnum.EnvMap:
      if (!envMap) {
        throw new Error('skyTexture is required');
      } else {
        return new THREE.MeshPhongMaterial({
          envMap: envMap,
          //map: new THREE.TextureLoader().load('water.jpg'),
          color: new THREE.Color('#54668e'),
          specular: new THREE.Color('#fff'),
          opacity: 0.95,
          transparent: true,
          side: THREE.FrontSide,
          reflectivity: 0.6,
          combine: THREE.MixOperation,
        });
      }

    case WaterTypeEnum.CustomShader:
      // material: make a THREE.ShaderMaterial clone of THREE.MeshPhongMaterial, with customized vertex shader
      return new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
          THREE.ShaderLib['phong'].uniforms,
          {
            heightmap: { value: null },
            diffuse: { value: new THREE.Color('#54668e') },
            specular: { value: new THREE.Color('#555') },
            shininess: { value: 5 },
            opacity: { value: 0.95 },
            envMap: { value: envMap },
            flipEnvMap: { value: -1 },
            maxMipLevel: { value: 0 },
            combine: { value: THREE.MixOperation },
            refractionRatio: { value: 0.98 },
            reflectivity: { value: 0.6 },
          },
        ]),
        defines: {
          WIDTH: segments.toFixed(1),
          BOUNDS: size.toFixed(1),
          USE_ENVMAP: '',
          ENVMAP_TYPE_CUBE: '',
          //ENVMAP_TYPE_CUBE_UV: true,
        },
        vertexShader: waterVertexShader,
        //vertexShader: THREE.ShaderChunk['meshphong_vert'],
        fragmentShader: THREE.ShaderChunk['meshphong_frag'],
        lights: true,
        transparent: true,
      });

    case WaterTypeEnum.ThreeExampleShader:
      throw new Error('not supported!');
  }
}

function getObject3DPrototype(waterType: WaterTypeEnum) {
  return WaterTypeEnum.Points === waterType ? THREE.Points : THREE.Mesh;
}

export function waterFactory(
  config: WaterConfig,
  renderer: THREE.WebGLRenderer,
  skyTexture?: THREE.CubeTexture | THREE.Texture
) {
  const { segmentCount, size, waterType, animationType } = config;

  switch (waterType) {
    case WaterTypeEnum.ThreeExampleShader: {
      const geometry = new THREE.PlaneBufferGeometry(segmentCount, segmentCount);
      const options: Options = {
        waterNormals: new THREE.TextureLoader().load('waternormals.jpg', texture => {
          texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        }),
        sunColor: 0xffffff,
        waterColor: 0x1234aa,
        distortionScale: 3.7,
        fog: false,
        alpha: 0.95,
      };
      return new ThreeExampleShaderWater(geometry, options);
    }

    default: {
      const waterAnimation = getWaterAnimation(animationType, segmentCount, renderer);
      const geometry = getGeometry(size, segmentCount);

      const material = getMaterial(waterType, size, segmentCount, skyTexture);
      const object3D = new (getObject3DPrototype(waterType))(geometry, material);
      object3D.rotation.x = -Math.PI / 2;

      object3D.onBeforeRender = () => {
        waterAnimation.applyTo(object3D);
      };

      waterAnimation.startAnim();
      return object3D;
    }
  }
}
