import { Group, AmbientLight, DirectionalLight } from 'three';

export class StaticLights extends Group {
  constructor() {
    super();
    this._initAmbient();
    this._initDirectional();

    this.matrixAutoUpdate = false;
    this.updateMatrix();
  }

  _initAmbient(): void {
    this.add(new AmbientLight('#3b2840', 0.1));
  }

  _initDirectional(): void {
    const lightDirectional = new DirectionalLight('#504d6b', 0.2);
    lightDirectional.position.set(0.5, 1, 0);
    this.add(lightDirectional);
  }
}
