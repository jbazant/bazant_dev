import * as THREE from 'three';

export class Bedrock extends THREE.Mesh {
  constructor(size: number) {
    const loader = new THREE.TextureLoader();
    loader.setPath('gravel/');

    const floorMaterial = new THREE.MeshStandardMaterial({
      map: loader.load('GRAVEL.png'),
      bumpMap: loader.load('GRAVEL_AO.png'),
      displacementMap: loader.load('GRAVEL_DISP1.png'),
      normalMap: loader.load('GRAVEL_NORM.png'),
      emissiveMap: loader.load('GRAVEL_SPEC.png'),
      emissive: 'rgba(255,215,182,0.96)',
      emissiveIntensity: 0.3,
      side: THREE.FrontSide,
    });

    const floorGeometry = new THREE.PlaneBufferGeometry(size, size, 10, 10);

    super(floorGeometry, floorMaterial);
    this.position.setY(-20);
    this.lookAt(new THREE.Vector3(0, 1, 0));
  }
}
