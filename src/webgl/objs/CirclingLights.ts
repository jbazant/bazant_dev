import {SmartObj} from '../general/SmartObj';
import {Group, Object3D, PointLight} from 'three';

export class CirclingLights extends SmartObj {
  obj: Object3D;

  init(): Array<Object3D> {
    return [
      this._initPoints(),
    ];
  }

  _initPoints(): Group {
    const colors = [
      'rgb(248, 231, 185)',
      'rgb(0, 115, 62)',
      'rgb(211, 32, 42)',
      'rgb(71, 65, 54)',
      'rgb(14, 104, 171)',
    ];

    const step = Math.PI * 2 / colors.length;
    const pointsDistance = 200;

    let lights = [];

    for (let i = 0; i < colors.length; ++i) {
      const light = new PointLight(colors[i], 0.8, 200);
      light.position.set(
        Math.cos(i * step) * pointsDistance,
        20,
        Math.sin(i * step) * pointsDistance)
      ;
      lights.push(light);
    }

    const group = new Group();
    group.add(...lights);

    this.obj = group;
    return group;
  }

  anim() {
    this.obj.rotateY(0.001);
  }
}