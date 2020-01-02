import {SmartObj} from './general/SmartObj';
import {AmbientLight, DirectionalLight, Object3D} from 'three';

export class StaticLights extends SmartObj {
  init(): Array<Object3D> {
    return [
      this._initAmbient(),
      this._initDirectional(),
    ];
  }

  _initAmbient() {
    return new AmbientLight(0x404040, 0.5);
  }

  _initDirectional() {
    const lightDirectional = new DirectionalLight(0x808080, 1);
    lightDirectional.position.set(0.5, 1,0);
    return lightDirectional;
  }
}