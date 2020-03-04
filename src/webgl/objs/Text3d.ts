import * as THREE from 'three';
import { assetsLoaderSingleton } from '../utils/AssetsLoader';

const BASE_GEOMETRY_PARAMS = {
  height: 1,
  size: 15,
  bevelEnabled: true,
  bevelSize: 0.5,
  bevelOffset: 0,
  bevelThickness: 1.5,
  bevelSegments: 2,
};

const getColor = (x: number) => Math.sin(x) * 0.4 + 0.5;

export class Text3d extends THREE.Mesh {
  textMaterial: THREE.MeshPhongMaterial;
  clock: THREE.Clock;

  constructor(lines: Array<string>) {
    super();

    this.clock = new THREE.Clock();
    this.textMaterial = new THREE.MeshPhongMaterial({ emissiveIntensity: 0.1, shininess: 100 });

    assetsLoaderSingleton.loadFont('gentilis_bold.typeface.json', font =>
      this._onFontLoaded(font, lines)
    );

    this.rotateY(Math.PI / 4);
    this.position.set(-5, 0, -5);
  }

  _createTextLine(text: string, font: THREE.Font, y: number) {
    const geometry = new THREE.TextBufferGeometry(text, { font, ...BASE_GEOMETRY_PARAMS });
    geometry.computeBoundingBox();

    const mesh = new THREE.Mesh(geometry, this.textMaterial);

    const textWidth = geometry.boundingBox.max.x - geometry.boundingBox.min.x;
    mesh.position.set(-0.5 * textWidth, y, 0);

    mesh.matrixAutoUpdate = false;
    mesh.updateMatrix();

    this.add(mesh);
  }

  _onFontLoaded(font: THREE.Font, lines: Array<string>) {
    lines.forEach((text, index) => {
      const y = (lines.length - index) * 20 - 10;
      this._createTextLine(text, font, y);
    });
  }

  onBeforeRender = () => {
    const t = this.clock.getElapsedTime();

    const color: [number, number, number] = [getColor(t / 50), getColor(t / 20), getColor(t / 30)];
    this.textMaterial.color.setRGB(...color);
    this.textMaterial.emissive.setRGB(...color);

    this.position.setY(Math.sin(t));
  };
}
