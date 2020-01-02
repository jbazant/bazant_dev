import {BoxGeometry, Color, Mesh, MeshPhongMaterial, Object3D, Vector3} from 'three';
import {SmartObj} from '../general/SmartObj';

export class ExampleBox extends SmartObj {
  cube: Object3D;

  rotationAxis = new Vector3(1, 1, 1);

  init() {
    const geometry = new BoxGeometry(50, 50, 50);
    const material = new MeshPhongMaterial({
      color: new Color(0.9, 0.7, 0.3),
      specular: new Color(0.5, 0.3, 0.1),
      reflectivity: 0.3,
      shininess: 0.1,
      envMap: null,
    });

    return [new Mesh(geometry, material)];
  }

  anim() {
    this.objs[0].rotateOnAxis(this.rotationAxis, .01);
  }
}