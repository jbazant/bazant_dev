import * as THREE from 'three';
import { AnimationTypeEnum, getWaterAnimation } from '../animations/getWaterAnimation';
import waterVertexShader from '../../shaders/heightmap_phong.vert';

export enum WaterTypeEnum {
  EnvMap,
  CustomShader,
  //ThreeExampleShader,
}

export type WaterConfig = {
  segmentCount: number;
  size: number;
  waterType: WaterTypeEnum;
  animationType: AnimationTypeEnum;
};

function getGeometry(size: number, segments: number) {
  return new THREE.PlaneBufferGeometry(size, size, segments - 1, segments - 1);
}

function getMaterial(
  waterType: WaterTypeEnum,
  size: number,
  segments: number,
  envMap?: THREE.CubeTexture | THREE.Texture
) {
  switch (waterType) {
    case WaterTypeEnum.EnvMap:
      if (!envMap) {
        throw new Error('envMap is required');
      }

      return new THREE.MeshPhongMaterial({
        envMap: envMap,
        color: new THREE.Color('#54668e'),
        specular: new THREE.Color('#fff'),
        opacity: 0.95,
        transparent: true,
        side: THREE.FrontSide,
        reflectivity: 0.6,
        combine: THREE.MixOperation,
      });

    case WaterTypeEnum.CustomShader:
      // material: make a THREE.ShaderMaterial clone of THREE.MeshPhongMaterial, with customized vertex shader
      const material = new THREE.ShaderMaterial({
        uniforms: THREE.UniformsUtils.merge([
          THREE.ShaderLib.phong.uniforms,
          {
            heightmap: { value: null },
            diffuse: { value: new THREE.Color('#445375') },
            specular: { value: new THREE.Color('#555') },
            shininess: { value: 5 },
            opacity: { value: 0.7 },
            reflectivity: { value: 0.7 },
            flipEnvMap: { value: 1 },
          },
        ]),
        defines: {
          WIDTH: segments.toFixed(1),
          BOUNDS: size.toFixed(1),
        },
        vertexShader: waterVertexShader,
        fragmentShader: THREE.ShaderLib.phong.fragmentShader,
        lights: true,
        transparent: true,
      });

      // @ts-ignore We really need to define this prop
      material.envMap = envMap;
      // @ts-ignore We really need to define this prop
      material.combine = THREE.AddOperation;
      material.uniforms.envMap.value = envMap;

      return material;
  }
}

export function waterFactory(
  config: WaterConfig,
  renderer: THREE.WebGLRenderer,
  skyTexture?: THREE.CubeTexture | THREE.Texture
): THREE.Object3D {
  const { segmentCount, size, waterType, animationType } = config;

  // /* THIS is altered ocean shader from THREE js examples. Let's keep it here for FFU */
  // if (waterType === WaterTypeEnum.ThreeExampleShader) {
  //   const geometry = new THREE.PlaneBufferGeometry(segmentCount, segmentCount);
  //   const options: Options = {
  //     waterNormals: assetsLoaderSingleton.loadTexture('waternormals.jpg', texture => {
  //       texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  //     }),
  //     sunColor: 0x555555,
  //     waterColor: 0x445375,
  //     distortionScale: 3.7,
  //     fog: false,
  //     alpha: 0.7,
  //   };
  //   return new ThreeExampleShaderWater(geometry, options);
  // }

  const waterAnimation = getWaterAnimation(animationType, segmentCount, renderer);
  const geometry = getGeometry(size, segmentCount);

  const material = getMaterial(waterType, size, segmentCount, skyTexture);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2;

  mesh.onBeforeRender = () => {
    waterAnimation.applyTo(mesh);
  };

  waterAnimation.startAnim();

  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();

  return mesh;
}
