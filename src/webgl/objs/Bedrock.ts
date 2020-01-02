import {
  FrontSide,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry, TextureLoader, Vector3,
} from 'three';
import {SmartObj} from '../general/SmartObj';

export class Bedrock extends SmartObj {
  init(size: number) {

    const loader = new TextureLoader();
    loader.setPath('gravel/');

    const floorMaterial = new MeshStandardMaterial({
      map: loader.load('GRAVEL.png'),
      bumpMap: loader.load('GRAVEL_AO.png'),
      displacementMap: loader.load('GRAVEL_DISP1.png'),
      normalMap: loader.load('GRAVEL_NORM.png'),
      emissiveMap: loader.load('GRAVEL_SPEC.png'),
      side: FrontSide,
    });

    const floorGeometry = new PlaneGeometry(size, size, 10, 10);
    const floor = new Mesh(floorGeometry, floorMaterial);
    floor.position.setY(-20);
    floor.lookAt(new Vector3(0, 1, 0));

    return [floor];
  }

}