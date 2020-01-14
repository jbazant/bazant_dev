import { Group, AmbientLight, DirectionalLight } from 'three';

export class StaticLights extends Group {
  constructor() {
    super();
    this._initAmbient();
    this._initDirectional();
  }

  _initAmbient() {
    this.add(new AmbientLight(0x404040, 0.5));
  }

  _initDirectional() {
    const lightDirectional = new DirectionalLight(0x808080, 1);
    lightDirectional.position.set(0.5, 1, 0);
    this.add(lightDirectional);
  }
}
