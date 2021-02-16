import { WaterAnimation } from './WaterAnimation';

export class NullAnimation extends WaterAnimation {
  startAnim(): void {
    return;
  }

  stopAnim(): void {
    return;
  }

  applyTo(): void {
    return;
  }
}
