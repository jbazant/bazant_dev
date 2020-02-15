import { WaterAnimation } from './WaterAnimation';

export class NullAnimation extends WaterAnimation {
  startAnim() {
    return;
  }

  stopAnim() {
    return;
  }

  applyTo() {
    return;
  }
}
