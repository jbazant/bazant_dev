import { SmartObj } from './general/SmartObj';
import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class MyCamera extends SmartObj {
  camera: PerspectiveCamera;
  aspect: number;

  constructor(aspect: number) {
    super();
    this.aspect = aspect;
  }

  init() {
    const camera = new PerspectiveCamera(50, this.aspect, 1, 5000);
    //camera.position.set(300, 500, 100);
    //camera.up.set(1, 0, 0);
    camera.position.set(500, 300, 700);
    camera.lookAt(new Vector3());

    this.camera = camera;
    new OrbitControls(camera);
    return [camera];
  }
}
