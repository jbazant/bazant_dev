import {
  FrontSide,
  Mesh,
  MeshStandardMaterial,
  PlaneGeometry,
  TextureLoader,
  Vector3,
} from 'three';

export class Bedrock extends Mesh {
  constructor(size: number) {
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

    super(floorGeometry, floorMaterial);
    this.position.setY(-20);
    this.lookAt(new Vector3(0, 1, 0));
  }
}
