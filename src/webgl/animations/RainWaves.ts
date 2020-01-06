import { WaterAnimation } from './WaterAnimation';
import { BufferGeometry } from 'three';
import { config } from '../../config';

export class RainWaves extends WaterAnimation {
  _matrix: Array<Array<Array<number>>>;
  _currHolderIndex: 0 | 1 = 0;
  _lastTime = 0;
  _animationConfig: typeof config.water.animationConfig;

  constructor(segmentCount: number, animationConfig: typeof config.water.animationConfig) {
    super(segmentCount, animationConfig);

    this._matrix = [new Array(segmentCount + 1), new Array(segmentCount + 1)];

    for (let i = 0; i <= segmentCount; ++i) {
      this._matrix[0][i] = new Array(segmentCount + 1).fill(0);
      this._matrix[1][i] = new Array(segmentCount + 1).fill(0);
    }
  }

  get _currentHolderIndex() {
    return this._currHolderIndex;
  }

  get _prevHolderIndex() {
    return 1 - this._currHolderIndex;
  }

  get matrix() {
    return this._matrix[this._currentHolderIndex];
  }

  get prevMatrix() {
    return this._matrix[this._prevHolderIndex];
  }

  _swapHolders() {
    // @ts-ignore result of operation is actually correct, but TS is unable to understand it
    this._currHolderIndex = 1 - this._currHolderIndex;
  }

  _recountWaves(timeDiff: number) {
    // todo move this to shader
    const time = WaterAnimation.timeMultiplier * timeDiff;
    const { speed, distance, density } = this._animationConfig;

    const deltaSpeed = (Math.sqrt(speed) * Math.sqrt(time)) / Math.sqrt(distance);
    const fPom = 1.0 / (density * time + 2);
    const k1 = (4.0 - 8.0 * deltaSpeed) * fPom;
    const k2 = (density * time - 2) * fPom;
    const k3 = 2.0 * (deltaSpeed * fPom);

    for (let j = 1; j < this.segmentCount; ++j) {
      for (let i = 1; i < this.segmentCount; ++i) {
        this.prevMatrix[i][j] =
          k1 * this.matrix[i][j] +
          k2 * this.prevMatrix[i][j] +
          k3 *
            (this.matrix[i + 1][j] +
              this.matrix[i - 1][j] +
              this.matrix[i][j + 1] +
              this.matrix[i][j - 1]);
      }
    }
  }

  _randomWaves(timeDiff: number) {
    const { wavesPerSecond } = this._animationConfig;
    const waveProbability = (timeDiff / 1000) * wavesPerSecond;

    if (waveProbability >= Math.random()) {
      const x = Math.floor(Math.random() * (this.segmentCount - 4)) + 2;
      const y = Math.floor(Math.random() * (this.segmentCount - 4)) + 2;
      this.startWave(x, y, 10);
    }
  }

  // uint, uint float
  startWave(x: number, y: number, power: number) {
    if (x < 1 || y < 1 || x > this.segmentCount || y > this.segmentCount) {
      throw new Error('Params out of bounds!');
    }

    for (let holder = 0; holder <= 1; ++holder) {
      for (let i = x - 1; i <= x + 1; i = i + 2) {
        for (let j = y - 1; j <= y + 1; j = j + 2) {
          this._matrix[holder][i][j] = power;
        }
      }
    }
  }

  anim(time: number): void {
    const timeDiff = time - this._lastTime;
    this._lastTime = time;

    this._randomWaves(timeDiff);
    this._recountWaves(timeDiff);
    this._swapHolders();
  }

  applyTo(geometry: BufferGeometry): void {
    // @ts-ignore
    geometry.attributes.position.needsUpdate = true;
    for (let i = 0; i <= this.segmentCount; i++) {
      for (let j = 0; j <= this.segmentCount; j++) {
        const index = 3 * (i + j * (this.segmentCount + 1)) + 1;
        // @ts-ignore
        geometry.attributes.position.array[index] = this.matrix[i][j];
      }
    }
    geometry.computeVertexNormals();
  }
}
