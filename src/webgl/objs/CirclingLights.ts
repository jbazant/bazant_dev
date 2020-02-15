import { Mesh, PointLight } from 'three';

export class CirclingLights extends Mesh {
  constructor() {
    super();

    const colors = [
      'rgb(248, 231, 185)',
      'rgb(0, 115, 62)',
      'rgb(211, 32, 42)',
      'rgb(14, 104, 171)',
    ];

    const step = (Math.PI * 2) / colors.length;
    const pointsDistance = 50;

    colors.forEach((color, i) => {
      const light = new PointLight(color, 0.8, 200);
      light.position.set(
        Math.cos(i * step) * pointsDistance,
        20,
        Math.sin(i * step) * pointsDistance
      );
      this.add(light);
    });
  }

  onBeforeRender = () => {
    this.rotateY(0.01);
  };
}
