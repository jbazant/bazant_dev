/**
 * @author jbouny / https://github.com/jbouny
 *
 * Work based on :
 * @author Slayvin / http://slayvin.net : Flat mirror for three.js
 * @author Stemkoski / http://www.adelphi.edu/~stemkoski : An implementation of water shader based on the flat mirror
 * @author Jonas Wagner / http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
 */

import {
  BufferGeometry,
  Color,
  FrontSide,
  LinearFilter,
  MathUtils,
  Matrix4,
  Mesh,
  PerspectiveCamera,
  Plane,
  RGBFormat,
  ShaderMaterial,
  UniformsLib,
  UniformsUtils,
  Vector3,
  Vector4,
  WebGLRenderTarget,
  Side,
  Scene,
  WebGLRenderer,
  Texture,
} from 'three';
import fragmentShader from '../../shaders/ShaderWater.frag';
import vertexShader from '../../shaders/ShaderWater.vert';

export interface Options {
  textureWidth?: number;
  textureHeight?: number;
  clipBias?: number;
  alpha?: number;
  time?: number;
  waterNormals?: Texture;
  sunDirection?: Vector3;
  sunColor?: number;
  waterColor?: number;
  distortionScale?: number;
  eye?: Vector3;
  side?: Side;
  fog?: boolean;
}

export class ThreeExampleShaderWater extends Mesh {
  mirrorPlane = new Plane();
  normal = new Vector3();
  mirrorWorldPosition = new Vector3();
  cameraWorldPosition = new Vector3();
  rotationMatrix = new Matrix4();
  lookAtPosition = new Vector3(0, 0, -1);
  clipPlane = new Vector4();

  view = new Vector3();
  target = new Vector3();
  q = new Vector4();
  textureMatrix = new Matrix4();
  mirrorCamera = new PerspectiveCamera();

  eye: Vector3;
  clipBias: number;
  renderTarget: WebGLRenderTarget;

  material: ShaderMaterial;

  constructor(geometry: BufferGeometry, options: Options = {}) {
    super(geometry);

    const textureWidth = options.textureWidth ?? 512;
    const textureHeight = options.textureHeight ?? 512;

    this.clipBias = options.clipBias ?? 0.0;
    const alpha = options.alpha ?? 1.0;
    const time = options.time ?? 0.0;
    const normalSampler = options.waterNormals ?? null;
    const sunDirection = options.sunDirection ?? new Vector3(0.70707, 0.70707, 0.0);
    const sunColor = new Color(options.sunColor ?? 0xffffff);
    const waterColor = new Color(options.waterColor ?? 0x7f7f7f);
    this.eye = options.eye ?? new Vector3(0, 0, 0);
    const distortionScale = options.distortionScale ?? 20.0;
    const side = options.side !== undefined ? options.side : FrontSide;
    const fog = options.fog ?? false;

    const parameters = {
      minFilter: LinearFilter,
      magFilter: LinearFilter,
      format: RGBFormat,
      stencilBuffer: false,
    };

    this.renderTarget = new WebGLRenderTarget(textureWidth, textureHeight, parameters);

    if (!MathUtils.isPowerOfTwo(textureWidth) || !MathUtils.isPowerOfTwo(textureHeight)) {
      this.renderTarget.texture.generateMipmaps = false;
    }

    const mirrorShader = {
      uniforms: UniformsUtils.merge([
        UniformsLib['fog'],
        UniformsLib['lights'],
        {
          normalSampler: { value: null },
          mirrorSampler: { value: null },
          alpha: { value: 1.0 },
          time: { value: 0.0 },
          size: { value: 1.0 },
          distortionScale: { value: 20.0 },
          textureMatrix: { value: new Matrix4() },
          sunColor: { value: new Color(0x7f7f7f) },
          sunDirection: { value: new Vector3(0.70707, 0.70707, 0) },
          eye: { value: new Vector3() },
          waterColor: { value: new Color(0x555555) },
        },
      ]),
      vertexShader,
      fragmentShader,
    };

    const material = new ShaderMaterial({
      fragmentShader: mirrorShader.fragmentShader,
      vertexShader: mirrorShader.vertexShader,
      uniforms: UniformsUtils.clone(mirrorShader.uniforms),
      transparent: true,
      lights: true,
      side: side,
      fog: fog,
    });

    material.uniforms['mirrorSampler'].value = this.renderTarget.texture;
    material.uniforms['textureMatrix'].value = this.textureMatrix;
    material.uniforms['alpha'].value = alpha;
    material.uniforms['time'].value = time;
    material.uniforms['normalSampler'].value = normalSampler;
    material.uniforms['sunColor'].value = sunColor;
    material.uniforms['waterColor'].value = waterColor;
    material.uniforms['sunDirection'].value = sunDirection;
    material.uniforms['distortionScale'].value = distortionScale;

    material.uniforms['eye'].value = this.eye;

    this.material = material;
    this.rotation.x = -Math.PI / 2;
  }

  onBeforeRender = (renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) => {
    this.material.uniforms['time'].value += 0.02;

    this.mirrorWorldPosition.setFromMatrixPosition(this.matrixWorld);
    this.cameraWorldPosition.setFromMatrixPosition(camera.matrixWorld);

    this.rotationMatrix.extractRotation(this.matrixWorld);

    this.normal.set(0, 0, 1);
    this.normal.applyMatrix4(this.rotationMatrix);

    this.view.subVectors(this.mirrorWorldPosition, this.cameraWorldPosition);

    // Avoid rendering when mirror is facing away

    if (this.view.dot(this.normal) > 0) return;

    this.view.reflect(this.normal).negate();
    this.view.add(this.mirrorWorldPosition);

    this.rotationMatrix.extractRotation(camera.matrixWorld);

    this.lookAtPosition.set(0, 0, -1);
    this.lookAtPosition.applyMatrix4(this.rotationMatrix);
    this.lookAtPosition.add(this.cameraWorldPosition);

    this.target.subVectors(this.mirrorWorldPosition, this.lookAtPosition);
    this.target.reflect(this.normal).negate();
    this.target.add(this.mirrorWorldPosition);

    this.mirrorCamera.position.copy(this.view);
    this.mirrorCamera.up.set(0, 1, 0);
    this.mirrorCamera.up.applyMatrix4(this.rotationMatrix);
    this.mirrorCamera.up.reflect(this.normal);
    this.mirrorCamera.lookAt(this.target);

    this.mirrorCamera.far = camera.far; // Used in WebGLBackground

    this.mirrorCamera.updateMatrixWorld(false);
    this.mirrorCamera.projectionMatrix.copy(camera.projectionMatrix);

    // Update the texture matrix
    this.textureMatrix.set(
      0.5,
      0.0,
      0.0,
      0.5,
      0.0,
      0.5,
      0.0,
      0.5,
      0.0,
      0.0,
      0.5,
      0.5,
      0.0,
      0.0,
      0.0,
      1.0
    );
    this.textureMatrix.multiply(this.mirrorCamera.projectionMatrix);
    this.textureMatrix.multiply(this.mirrorCamera.matrixWorldInverse);

    // Now update projection matrix with new clip plane, implementing code from: http://www.terathon.com/code/oblique.html
    // Paper explaining this technique: http://www.terathon.com/lengyel/Lengyel-Oblique.pdf
    this.mirrorPlane.setFromNormalAndCoplanarPoint(this.normal, this.mirrorWorldPosition);
    this.mirrorPlane.applyMatrix4(this.mirrorCamera.matrixWorldInverse);

    this.clipPlane.set(
      this.mirrorPlane.normal.x,
      this.mirrorPlane.normal.y,
      this.mirrorPlane.normal.z,
      this.mirrorPlane.constant
    );

    const projectionMatrix = this.mirrorCamera.projectionMatrix;

    this.q.x =
      (Math.sin(this.clipPlane.x) + projectionMatrix.elements[8]) / projectionMatrix.elements[0];
    this.q.y =
      (Math.sin(this.clipPlane.y) + projectionMatrix.elements[9]) / projectionMatrix.elements[5];
    this.q.z = -1.0;
    this.q.w = (1.0 + projectionMatrix.elements[10]) / projectionMatrix.elements[14];

    // Calculate the scaled plane vector
    this.clipPlane.multiplyScalar(2.0 / this.clipPlane.dot(this.q));

    // Replacing the third row of the projection matrix
    projectionMatrix.elements[2] = this.clipPlane.x;
    projectionMatrix.elements[6] = this.clipPlane.y;
    projectionMatrix.elements[10] = this.clipPlane.z + 1.0 - this.clipBias;
    projectionMatrix.elements[14] = this.clipPlane.w;

    this.eye.setFromMatrixPosition(camera.matrixWorld);

    const currentRenderTarget = renderer.getRenderTarget();

    const currentXrEnabled = renderer.xr?.enabled ?? true;
    const currentShadowAutoUpdate = renderer.shadowMap.autoUpdate;

    this.visible = false;

    renderer.xr.enabled = false; // Avoid camera modification and recursion
    renderer.shadowMap.autoUpdate = false; // Avoid re-computing shadows

    renderer.setRenderTarget(this.renderTarget);
    renderer.clear();
    renderer.render(scene, this.mirrorCamera);

    this.visible = true;

    renderer.xr.enabled = currentXrEnabled;
    renderer.shadowMap.autoUpdate = currentShadowAutoUpdate;

    renderer.setRenderTarget(currentRenderTarget);
  };
}
