import { WaterAnimation } from './WaterAnimation';

export class NullAnimation extends WaterAnimation {
  anim() {
    return;
  }

  applyTo() {
    return;
  }
}
