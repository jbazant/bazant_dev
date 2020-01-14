uniform mat4 textureMatrix;
uniform float time;
varying vec4 mirrorCoord;
varying vec4 worldPosition;

//ShaderChunk fog_pars_vertex
#ifdef USE_FOG
    varying float fogDepth;
#endif

//ShaderChunk shadowmap_pars_vertex
#ifdef USE_SHADOWMAP
    #if NUM_DIR_LIGHTS > 0
        uniform mat4 directionalShadowMatrix[NUM_DIR_LIGHTS];
        varying vec4 vDirectionalShadowCoord[NUM_DIR_LIGHTS];
    #endif
    #if NUM_SPOT_LIGHTS > 0
        uniform mat4 spotShadowMatrix[NUM_SPOT_LIGHTS];
        varying vec4 vSpotShadowCoord[NUM_SPOT_LIGHTS];
    #endif
    #if NUM_POINT_LIGHTS > 0
        uniform mat4 pointShadowMatrix[NUM_POINT_LIGHTS];
        varying vec4 vPointShadowCoord[NUM_POINT_LIGHTS];
    #endif
#endif

void main() {
    mirrorCoord = modelMatrix * vec4(position, 1.0);
    worldPosition = mirrorCoord.xyzw;
    mirrorCoord = textureMatrix * mirrorCoord;
    vec4 mvPosition =  modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    #ifdef USE_FOG
        fogDepth = -mvPosition.z;
    #endif

    #ifdef USE_SHADOWMAP
        #if NUM_DIR_LIGHTS > 0
            #pragma unroll_loop
            for (int i = 0; i < NUM_DIR_LIGHTS; i ++) {
                vDirectionalShadowCoord[i] = directionalShadowMatrix[i] * worldPosition;
            }
        #endif
        #if NUM_SPOT_LIGHTS > 0
            #pragma unroll_loop
            for (int i = 0; i < NUM_SPOT_LIGHTS; i ++) {
                vSpotShadowCoord[i] = spotShadowMatrix[i] * worldPosition;
            }
        #endif
        #if NUM_POINT_LIGHTS > 0
            #pragma unroll_loop
            for (int i = 0; i < NUM_POINT_LIGHTS; i ++) {
                vPointShadowCoord[i] = pointShadowMatrix[i] * worldPosition;
            }
        #endif
    #endif
}