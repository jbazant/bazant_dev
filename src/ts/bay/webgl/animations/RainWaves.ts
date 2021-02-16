import { WaterAnimation } from './WaterAnimation';
import * as THREE from 'three';
import {
  GPUComputationRenderer,
  GPUComputationRendererVariable,
} from '../utils/GPUComputationRenderer';
import heightmapComputeShader from '../../shaders/compute_heightmap.frag';

export class RainWaves extends WaterAnimation {
  gpuCompute: GPUComputationRenderer;
  heightmapVariable: GPUComputationRendererVariable;
  halfCount: number;
  timers: Array<NodeJS.Timeout>;

  constructor(segmentCount: number, renderer: THREE.WebGLRenderer) {
    super(segmentCount, renderer);
    this.halfCount = segmentCount / 2;

    this.gpuCompute = new GPUComputationRenderer(segmentCount, segmentCount, renderer);

    this.heightmapVariable = this.gpuCompute.addVariable(
      'heightmap',
      heightmapComputeShader,
      this.gpuCompute.createTexture()
    );
    this.heightmapVariable.setDependencies([this.heightmapVariable]);
    this.heightmapVariable.setWrapping(THREE.MirroredRepeatWrapping);
    this.heightmapVariable.setMaterialUniforms({
      wavePos: { value: new THREE.Vector2(0, 0) },
      waveSize: { value: 0 },
      viscosityConstant: { value: 0.98 },
    });
    this.heightmapVariable.addMaterialDefine('BOUNDS', segmentCount.toFixed(1));

    this.gpuCompute.init();
  }

  _getRandCoordinate(): number {
    return Math.floor(Math.random() * this.segmentCount - this.halfCount);
  }

  _rainDrop = (): void => {
    const x = this._getRandCoordinate();
    const y = this._getRandCoordinate();
    this.startWave(x, y, 5);
    setTimeout(() => this.startWave(x, y, 2), 200);
  };

  startWave = (x: number, y: number, size: number): void => {
    this.heightmapVariable.material.uniforms['wavePos'].value = new THREE.Vector2(x, y);
    this.heightmapVariable.material.uniforms['waveSize'].value = size;
  };

  startAnim(): void {
    this.timers = [301, 501, 701].map((timeout) => setInterval(this._rainDrop, timeout));
  }

  stopAnim(): void {
    this.timers.forEach(clearInterval);
  }

  applyTo(object: THREE.Object3D): void {
    if (object instanceof THREE.Mesh) {
      const material = object.material;

      if (material instanceof THREE.ShaderMaterial) {
        this.gpuCompute.compute();
        this.heightmapVariable.material.uniforms['waveSize'].value = 0;

        material.uniforms.heightmap.value = this.gpuCompute.getCurrentRenderTarget(
          this.heightmapVariable
        ).texture;
      } else {
        console.warn('Invalid material supplied to RainWaves');
      }
    } else {
      console.warn('Invalid object supplied to RainWaves');
    }
  }
}
