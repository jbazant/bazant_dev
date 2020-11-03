import { Vector3 } from 'three';
import { Firefly, FireflyConfig } from './Firefly';

export type FireflyShape = {
  offset: { x: number; y: number; z: number };
  maxDeviation: number;
};

export type FirefliesShape = Array<FireflyShape>;

export function firefliesFactory(fireflies: FirefliesShape, config: FireflyConfig) {
  return fireflies.map((it) => {
    const { x, y, z } = it.offset;
    const position = new Vector3(x, y, z);

    return new Firefly(position, it.maxDeviation, config);
  });
}
