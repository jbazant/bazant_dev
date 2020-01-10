import {
  BufferGeometry,
  CubeTexture,
  Float32BufferAttribute,
  FrontSide,
  Mesh,
  MeshLambertMaterial,
  TextureLoader,
} from 'three';
import { WaterAnimation } from '../animations/WaterAnimation';

function _getMaterial(skyTexture: CubeTexture) {
  const waterTexture = new TextureLoader().load('water.jpg');
  return new MeshLambertMaterial({
    envMap: skyTexture,
    map: waterTexture,
    opacity: 0.9,
    transparent: true,
    side: FrontSide,
  });
}


// todo this should actually be factory
// todo combine it with WaterObject3DFactory
/*
export function getWater(
  size: number,
  segments: number,
  waterAnimation: WaterAnimation,
  skyTexture: CubeTexture
) {
  const geometry = _getGeometry(size, segments);
  const material = _getMaterial(skyTexture);
  const mesh = new Mesh(geometry, material);

  mesh.onBeforeRender = function() {
    waterAnimation.anim(10);
    waterAnimation.applyTo(geometry);
  };

  return mesh;
}
*/