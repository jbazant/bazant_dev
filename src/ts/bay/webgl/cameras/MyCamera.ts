import { PerspectiveCamera, Vector3 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export class MyCamera extends PerspectiveCamera {
  orbitControls: OrbitControls;

  constructor(
    aspect: number,
    el: HTMLCanvasElement,
    { allowOrbitControls }: { allowOrbitControls: boolean }
  ) {
    super(50, aspect, 1, 5000);
    this.position.set(105, 20, 100);
    this.lookAt(new Vector3());

    if (allowOrbitControls) {
      this.orbitControls = new OrbitControls(this, el);
    }
  }
}
