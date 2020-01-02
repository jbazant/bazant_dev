import {WaterAnimation} from './WaterAnimation';
import {BufferGeometry} from 'three';

export class NullAnimation extends WaterAnimation {
  anim(time: number) {}

  applyTo(geometry: BufferGeometry) {}
}