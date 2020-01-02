import {Object3D, Scene} from 'three';

export class SmartObj {
  objs: Array<Object3D>;

  constructor(...args: any) {
    this.objs = this.init(...args);
  }

  init(...args: any): Array<Object3D> {
    return [];
  }

  addTo(scene: Scene) {
    scene.add(...this.objs);
  }

  removeFrom(scene: Scene) {
    scene.remove(...this.objs);
  };

  anim(time: number) {

  };
}