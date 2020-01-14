import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class MyCamera extends PerspectiveCamera {
  orbitControls: OrbitControls;

  constructor(aspect: number, el: HTMLCanvasElement) {
    super(50, aspect, 1, 5000);
    this.position.set(0, 100, 50);
    this.lookAt(new Vector3());

    this.orbitControls = new OrbitControls(this, el);
  }
}
