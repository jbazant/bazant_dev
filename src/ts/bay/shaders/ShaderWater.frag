uniform sampler2D mirrorSampler;
uniform float alpha;
uniform float time;
uniform float size;
uniform float distortionScale;
uniform sampler2D normalSampler;
uniform vec3 sunColor;
uniform vec3 sunDirection;
uniform vec3 eye;
uniform vec3 waterColor;
varying vec4 mirrorCoord;
varying vec4 worldPosition;

vec4 getNoise(vec2 uv) {
    vec2 uv0 = (uv / 103.0) + vec2(time / 17.0, time / 29.0);
    vec2 uv1 = uv / 107.0-vec2(time / -19.0, time / 31.0);
    vec2 uv2 = uv / vec2(8907.0, 9803.0) + vec2(time / 101.0, time / 97.0);
    vec2 uv3 = uv / vec2(1091.0, 1027.0) - vec2(time / 109.0, time / -113.0);
    vec4 noise = texture2D(normalSampler, uv0) +
    texture2D(normalSampler, uv1) +
    texture2D(normalSampler, uv2) +
    texture2D(normalSampler, uv3);
    return noise * 0.5 - 1.0;
}

void sunLight(const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor) {
    vec3 reflection = normalize(reflect(-sunDirection, surfaceNormal));
    float direction = max(0.0, dot(eyeDirection, reflection));
    specularColor += pow(direction, shiny) * sunColor * spec;
    diffuseColor += max(dot(sunDirection, surfaceNormal), 0.0) * sunColor * diffuse;
}

    //ShaderChunk common
    #define PI 3.14159265359
    #define PI2 6.28318530718
    #define PI_HALF 1.5707963267949
    #define RECIPROCAL_PI 0.31830988618
    #define RECIPROCAL_PI2 0.15915494
    #define LOG2 1.442695
    #define EPSILON 1e-6
    //#define saturate(a) clamp(a, 0.0, 1.0)
    #define whiteCompliment(a) (1.0 - saturate(a))
float pow2(const in float x) { return x*x; }
float pow3(const in float x) { return x*x*x; }
float pow4(const in float x) { float x2 = x*x; return x2*x2; }
float average(const in vec3 color) { return dot(color, vec3(0.3333)); }
highp float rand(const in vec2 uv) {
    const highp float a = 12.9898, b = 78.233, c = 43758.5453;
    highp float dt = dot(uv.xy, vec2(a, b)), sn = mod(dt, PI);
    return fract(sin(sn) * c);
}
struct IncidentLight {
    vec3 color;
    vec3 direction;
    bool visible;
};
struct ReflectedLight {
    vec3 directDiffuse;
    vec3 directSpecular;
    vec3 indirectDiffuse;
    vec3 indirectSpecular;
};
struct GeometricContext {
    vec3 position;
    vec3 normal;
    vec3 viewDir;
};
vec3 transformDirection(in vec3 dir, in mat4 matrix) {
    return normalize((matrix * vec4(dir, 0.0)).xyz);
}
vec3 inverseTransformDirection(in vec3 dir, in mat4 matrix) {
    return normalize((vec4(dir, 0.0) * matrix).xyz);
}
vec3 projectOnPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal) {
    float distance = dot(planeNormal, point - pointOnPlane);
    return - distance * planeNormal + point;
}
float sideOfPlane(in vec3 point, in vec3 pointOnPlane, in vec3 planeNormal) {
    return sign(dot(point - pointOnPlane, planeNormal));
}
vec3 linePlaneIntersect(in vec3 pointOnLine, in vec3 lineDirection, in vec3 pointOnPlane, in vec3 planeNormal) {
    return lineDirection * (dot(planeNormal, pointOnPlane - pointOnLine) / dot(planeNormal, lineDirection)) + pointOnLine;
}
mat3 transposeMat3(const in mat3 m) {
    mat3 tmp;
    tmp[0] = vec3(m[0].x, m[1].x, m[2].x);
    tmp[1] = vec3(m[0].y, m[1].y, m[2].y);
    tmp[2] = vec3(m[0].z, m[1].z, m[2].z);
    return tmp;
}
float linearToRelativeLuminance(const in vec3 color) {
    vec3 weights = vec3(0.2126, 0.7152, 0.0722);
    return dot(weights, color.rgb);
}
//ShaderChunk packing
vec3 packNormalToRGB(const in vec3 normal) {
    return normalize(normal) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal(const in vec3 rgb) {
    return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3(256. * 256. * 256., 256. * 256., 256.);
const vec4 UnpackFactors = UnpackDownscale / vec4(PackFactors, 1.);
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA(const in float v) {
    vec4 r = vec4(fract(v * PackFactors), v);
    r.yzw -= r.xyz * ShiftRight8;    return r * PackUpscale;
}
float unpackRGBAToDepth(const in vec4 v) {
    return dot(v, UnpackFactors);
}
float viewZToOrthographicDepth(const in float viewZ, const in float near, const in float far) {
    return (viewZ + near) / (near - far);
}
float orthographicDepthToViewZ(const in float linearClipZ, const in float near, const in float far) {
    return linearClipZ * (near - far) - near;
}
float viewZToPerspectiveDepth(const in float viewZ, const in float near, const in float far) {
    return ((near + viewZ) * far) / ((far - near) * viewZ);
}
float perspectiveDepthToViewZ(const in float invClipZ, const in float near, const in float far) {
    return (near * far) / ((far - near) * invClipZ - far);
}

//ShaderChunk bsdfs
vec2 integrateSpecularBRDF(const in float dotNV, const in float roughness) {
    const vec4 c0 = vec4(- 1, - 0.0275, - 0.572, 0.022);
    const vec4 c1 = vec4(1, 0.0425, 1.04, - 0.04);
    vec4 r = roughness * c0 + c1;
    float a004 = min(r.x * r.x, exp2(- 9.28 * dotNV)) * r.x + r.y;
    return vec2(-1.04, 1.04) * a004 + r.zw;
}
float punctualLightIntensityToIrradianceFactor(const in float lightDistance, const in float cutoffDistance, const in float decayExponent) {
    #if defined (PHYSICALLY_CORRECT_LIGHTS)
    float distanceFalloff = 1.0 / max(pow(lightDistance, decayExponent), 0.01);
    if (cutoffDistance > 0.0) {
        distanceFalloff *= pow2(saturate(1.0 - pow4(lightDistance / cutoffDistance)));
    }
    return distanceFalloff;
    #else
    if (cutoffDistance > 0.0 && decayExponent > 0.0) {
        return pow(saturate(-lightDistance / cutoffDistance + 1.0), decayExponent);
    }
    return 1.0;
    #endif
}
vec3 BRDF_Diffuse_Lambert(const in vec3 diffuseColor) {
    return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick(const in vec3 specularColor, const in float dotLH) {
    float fresnel = exp2((-5.55473 * dotLH - 6.98316) * dotLH);
    return (1.0 - specularColor) * fresnel + specularColor;
}
float G_GGX_Smith(const in float alpha, const in float dotNL, const in float dotNV) {
    float a2 = pow2(alpha);
    float gl = dotNL + sqrt(a2 + (1.0 - a2) * pow2(dotNL));
    float gv = dotNV + sqrt(a2 + (1.0 - a2) * pow2(dotNV));
    return 1.0 / (gl * gv);
}
float G_GGX_SmithCorrelated(const in float alpha, const in float dotNL, const in float dotNV) {
    float a2 = pow2(alpha);
    float gv = dotNL * sqrt(a2 + (1.0 - a2) * pow2(dotNV));
    float gl = dotNV * sqrt(a2 + (1.0 - a2) * pow2(dotNL));
    return 0.5 / max(gv + gl, EPSILON);
}
float D_GGX(const in float alpha, const in float dotNH) {
    float a2 = pow2(alpha);
    float denom = pow2(dotNH) * (a2 - 1.0) + 1.0;
    return RECIPROCAL_PI * a2 / pow2(denom);
}
vec3 BRDF_Specular_GGX(const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float roughness) {
    float alpha = pow2(roughness);
    vec3 halfDir = normalize(incidentLight.direction + geometry.viewDir);
    float dotNL = saturate(dot(geometry.normal, incidentLight.direction));
    float dotNV = saturate(dot(geometry.normal, geometry.viewDir));
    float dotNH = saturate(dot(geometry.normal, halfDir));
    float dotLH = saturate(dot(incidentLight.direction, halfDir));
    vec3 F = F_Schlick(specularColor, dotLH);
    float G = G_GGX_SmithCorrelated(alpha, dotNL, dotNV);
    float D = D_GGX(alpha, dotNH);
    return F * (G * D);
}
vec2 LTC_Uv(const in vec3 N, const in vec3 V, const in float roughness) {
    const float LUT_SIZE  = 64.0;
    const float LUT_SCALE = (LUT_SIZE - 1.0) / LUT_SIZE;
    const float LUT_BIAS  = 0.5 / LUT_SIZE;
    float dotNV = saturate(dot(N, V));
    vec2 uv = vec2(roughness, sqrt(1.0 - dotNV));
    uv = uv * LUT_SCALE + LUT_BIAS;
    return uv;
}
float LTC_ClippedSphereFormFactor(const in vec3 f) {
    float l = length(f);
    return max((l * l + f.z) / (l + 1.0), 0.0);
}
vec3 LTC_EdgeVectorFormFactor(const in vec3 v1, const in vec3 v2) {
    float x = dot(v1, v2);
    float y = abs(x);
    float a = 0.8543985 + (0.4965155 + 0.0145206 * y) * y;
    float b = 3.4175940 + (4.1616724 + y) * y;
    float v = a / b;
    float theta_sintheta = (x > 0.0) ? v : 0.5 * inversesqrt(max(1.0 - x * x, 1e-7)) - v;
    return cross(v1, v2) * theta_sintheta;
}
vec3 LTC_Evaluate(const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[4]) {
    vec3 v1 = rectCoords[1] - rectCoords[0];
    vec3 v2 = rectCoords[3] - rectCoords[0];
    vec3 lightNormal = cross(v1, v2);
    if (dot(lightNormal, P - rectCoords[0]) < 0.0) return vec3(0.0);
    vec3 T1, T2;
    T1 = normalize(V - N * dot(V, N));
    T2 = - cross(N, T1);
    mat3 mat = mInv * transposeMat3(mat3(T1, T2, N));
    vec3 coords[4];
    coords[0] = mat * (rectCoords[0] - P);
    coords[1] = mat * (rectCoords[1] - P);
    coords[2] = mat * (rectCoords[2] - P);
    coords[3] = mat * (rectCoords[3] - P);
    coords[0] = normalize(coords[0]);
    coords[1] = normalize(coords[1]);
    coords[2] = normalize(coords[2]);
    coords[3] = normalize(coords[3]);
    vec3 vectorFormFactor = vec3(0.0);
    vectorFormFactor += LTC_EdgeVectorFormFactor(coords[0], coords[1]);
    vectorFormFactor += LTC_EdgeVectorFormFactor(coords[1], coords[2]);
    vectorFormFactor += LTC_EdgeVectorFormFactor(coords[2], coords[3]);
    vectorFormFactor += LTC_EdgeVectorFormFactor(coords[3], coords[0]);
    float result = LTC_ClippedSphereFormFactor(vectorFormFactor);
    return vec3(result);
}
vec3 BRDF_Specular_GGX_Environment(const in GeometricContext geometry, const in vec3 specularColor, const in float roughness) {
    float dotNV = saturate(dot(geometry.normal, geometry.viewDir));
    vec2 brdf = integrateSpecularBRDF(dotNV, roughness);
    return specularColor * brdf.x + brdf.y;
}
void BRDF_Specular_Multiscattering_Environment(const in GeometricContext geometry, const in vec3 specularColor, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter) {
    float dotNV = saturate(dot(geometry.normal, geometry.viewDir));
    vec3 F = F_Schlick(specularColor, dotNV);
    vec2 brdf = integrateSpecularBRDF(dotNV, roughness);
    vec3 FssEss = F * brdf.x + brdf.y;
    float Ess = brdf.x + brdf.y;
    float Ems = 1.0 - Ess;
    vec3 Favg = specularColor + (1.0 - specularColor) * 0.047619;    vec3 Fms = FssEss * Favg / (1.0 - Ems * Favg);
    singleScatter += FssEss;
    multiScatter += Fms * Ems;
}
float G_BlinnPhong_Implicit() {
    return 0.25;
}
float D_BlinnPhong(const in float shininess, const in float dotNH) {
    return RECIPROCAL_PI * (shininess * 0.5 + 1.0) * pow(dotNH, shininess);
}
vec3 BRDF_Specular_BlinnPhong(const in IncidentLight incidentLight, const in GeometricContext geometry, const in vec3 specularColor, const in float shininess) {
    vec3 halfDir = normalize(incidentLight.direction + geometry.viewDir);
    float dotNH = saturate(dot(geometry.normal, halfDir));
    float dotLH = saturate(dot(incidentLight.direction, halfDir));
    vec3 F = F_Schlick(specularColor, dotLH);
    float G = G_BlinnPhong_Implicit();
    float D = D_BlinnPhong(shininess, dotNH);
    return F * (G * D);
}
float GGXRoughnessToBlinnExponent(const in float ggxRoughness) {
    return (2.0 / pow2(ggxRoughness + 0.0001) - 2.0);
}
float BlinnExponentToGGXRoughness(const in float blinnExponent) {
    return sqrt(2.0 / (blinnExponent + 2.0));
}
    //ShaderChunk fog_pars_fragment
    #ifdef USE_FOG
uniform vec3 fogColor;
varying float fogDepth;
#ifdef FOG_EXP2
uniform float fogDensity;
#else
uniform float fogNear;
uniform float fogFar;
#endif
#endif
//ShaderChunk lights_pars_begin
uniform vec3 ambientLightColor;
uniform vec3 lightProbe[9];
vec3 shGetIrradianceAt(in vec3 normal, in vec3 shCoefficients[9]) {
    float x = normal.x, y = normal.y, z = normal.z;
    vec3 result = shCoefficients[0] * 0.886227;
    result += shCoefficients[1] * 2.0 * 0.511664 * y;
    result += shCoefficients[2] * 2.0 * 0.511664 * z;
    result += shCoefficients[3] * 2.0 * 0.511664 * x;
    result += shCoefficients[4] * 2.0 * 0.429043 * x * y;
    result += shCoefficients[5] * 2.0 * 0.429043 * y * z;
    result += shCoefficients[6] * (0.743125 * z * z - 0.247708);
    result += shCoefficients[7] * 2.0 * 0.429043 * x * z;
    result += shCoefficients[8] * 0.429043 * (x * x - y * y);
    return result;
}
vec3 getLightProbeIrradiance(const in vec3 lightProbe[9], const in GeometricContext geometry) {
    vec3 worldNormal = inverseTransformDirection(geometry.normal, viewMatrix);
    vec3 irradiance = shGetIrradianceAt(worldNormal, lightProbe);
    return irradiance;
}
vec3 getAmbientLightIrradiance(const in vec3 ambientLightColor) {
    vec3 irradiance = ambientLightColor;
    #ifndef PHYSICALLY_CORRECT_LIGHTS
    irradiance *= PI;
    #endif
    return irradiance;
}
    #if NUM_DIR_LIGHTS > 0
struct DirectionalLight {
    vec3 direction;
    vec3 color;
    int shadow;
    float shadowBias;
    float shadowRadius;
    vec2 shadowMapSize;
};
uniform DirectionalLight directionalLights[NUM_DIR_LIGHTS];
void getDirectionalDirectLightIrradiance(const in DirectionalLight directionalLight, const in GeometricContext geometry, out IncidentLight directLight) {
    directLight.color = directionalLight.color;
    directLight.direction = directionalLight.direction;
    directLight.visible = true;
}
    #endif
    #if NUM_POINT_LIGHTS > 0
struct PointLight {
    vec3 position;
    vec3 color;
    float distance;
    float decay;
    int shadow;
    float shadowBias;
    float shadowRadius;
    vec2 shadowMapSize;
    float shadowCameraNear;
    float shadowCameraFar;
};
uniform PointLight pointLights[NUM_POINT_LIGHTS];
void getPointDirectLightIrradiance(const in PointLight pointLight, const in GeometricContext geometry, out IncidentLight directLight) {
    vec3 lVector = pointLight.position - geometry.position;
    directLight.direction = normalize(lVector);
    float lightDistance = length(lVector);
    directLight.color = pointLight.color;
    directLight.color *= punctualLightIntensityToIrradianceFactor(lightDistance, pointLight.distance, pointLight.decay);
    directLight.visible = (directLight.color != vec3(0.0));
}
    #endif
    #if NUM_SPOT_LIGHTS > 0
struct SpotLight {
    vec3 position;
    vec3 direction;
    vec3 color;
    float distance;
    float decay;
    float coneCos;
    float penumbraCos;
    int shadow;
    float shadowBias;
    float shadowRadius;
    vec2 shadowMapSize;
};
uniform SpotLight spotLights[NUM_SPOT_LIGHTS];
void getSpotDirectLightIrradiance(const in SpotLight spotLight, const in GeometricContext geometry, out IncidentLight directLight) {
    vec3 lVector = spotLight.position - geometry.position;
    directLight.direction = normalize(lVector);
    float lightDistance = length(lVector);
    float angleCos = dot(directLight.direction, spotLight.direction);
    if (angleCos > spotLight.coneCos) {
        float spotEffect = smoothstep(spotLight.coneCos, spotLight.penumbraCos, angleCos);
        directLight.color = spotLight.color;
        directLight.color *= spotEffect * punctualLightIntensityToIrradianceFactor(lightDistance, spotLight.distance, spotLight.decay);
        directLight.visible = true;
    } else {
        directLight.color = vec3(0.0);
        directLight.visible = false;
    }
}
    #endif
    #if NUM_RECT_AREA_LIGHTS > 0
struct RectAreaLight {
    vec3 color;
    vec3 position;
    vec3 halfWidth;
    vec3 halfHeight;
};
uniform sampler2D ltc_1;    uniform sampler2D ltc_2;
uniform RectAreaLight rectAreaLights[NUM_RECT_AREA_LIGHTS];
#endif
#if NUM_HEMI_LIGHTS > 0
struct HemisphereLight {
    vec3 direction;
    vec3 skyColor;
    vec3 groundColor;
};
uniform HemisphereLight hemisphereLights[NUM_HEMI_LIGHTS];
vec3 getHemisphereLightIrradiance(const in HemisphereLight hemiLight, const in GeometricContext geometry) {
    float dotNL = dot(geometry.normal, hemiLight.direction);
    float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
    vec3 irradiance = mix(hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight);
    #ifndef PHYSICALLY_CORRECT_LIGHTS
    irradiance *= PI;
    #endif
    return irradiance;
}
    #endif
    //ShaderChunk shadowmap_pars_fragment
    #ifdef USE_SHADOWMAP
    #if NUM_DIR_LIGHTS > 0
uniform sampler2D directionalShadowMap[NUM_DIR_LIGHTS];
varying vec4 vDirectionalShadowCoord[NUM_DIR_LIGHTS];
#endif
#if NUM_SPOT_LIGHTS > 0
uniform sampler2D spotShadowMap[NUM_SPOT_LIGHTS];
varying vec4 vSpotShadowCoord[NUM_SPOT_LIGHTS];
#endif
#if NUM_POINT_LIGHTS > 0
uniform sampler2D pointShadowMap[NUM_POINT_LIGHTS];
varying vec4 vPointShadowCoord[NUM_POINT_LIGHTS];
#endif
float texture2DCompare(sampler2D depths, vec2 uv, float compare) {
    return step(compare, unpackRGBAToDepth(texture2D(depths, uv)));
}
float texture2DShadowLerp(sampler2D depths, vec2 size, vec2 uv, float compare) {
    const vec2 offset = vec2(0.0, 1.0);
    vec2 texelSize = vec2(1.0) / size;
    vec2 centroidUV = floor(uv * size + 0.5) / size;
    float lb = texture2DCompare(depths, centroidUV + texelSize * offset.xx, compare);
    float lt = texture2DCompare(depths, centroidUV + texelSize * offset.xy, compare);
    float rb = texture2DCompare(depths, centroidUV + texelSize * offset.yx, compare);
    float rt = texture2DCompare(depths, centroidUV + texelSize * offset.yy, compare);
    vec2 f = fract(uv * size + 0.5);
    float a = mix(lb, lt, f.y);
    float b = mix(rb, rt, f.y);
    float c = mix(a, b, f.x);
    return c;
}
float getShadow(sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord) {
    float shadow = 1.0;
    shadowCoord.xyz /= shadowCoord.w;
    shadowCoord.z += shadowBias;
    bvec4 inFrustumVec = bvec4 (shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0);
    bool inFrustum = all(inFrustumVec);
    bvec2 frustumTestVec = bvec2(inFrustum, shadowCoord.z <= 1.0);
    bool frustumTest = all(frustumTestVec);
    if (frustumTest) {
        #if defined(SHADOWMAP_TYPE_PCF)
        vec2 texelSize = vec2(1.0) / shadowMapSize;
        float dx0 = - texelSize.x * shadowRadius;
        float dy0 = - texelSize.y * shadowRadius;
        float dx1 = + texelSize.x * shadowRadius;
        float dy1 = + texelSize.y * shadowRadius;
        shadow = (
        texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx0, dy0), shadowCoord.z) +
        texture2DCompare(shadowMap, shadowCoord.xy + vec2(0.0, dy0), shadowCoord.z) +
        texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx1, dy0), shadowCoord.z) +
        texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx0, 0.0), shadowCoord.z) +
        texture2DCompare(shadowMap, shadowCoord.xy, shadowCoord.z) +
        texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx1, 0.0), shadowCoord.z) +
        texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx0, dy1), shadowCoord.z) +
        texture2DCompare(shadowMap, shadowCoord.xy + vec2(0.0, dy1), shadowCoord.z) +
        texture2DCompare(shadowMap, shadowCoord.xy + vec2(dx1, dy1), shadowCoord.z)
        ) * (1.0 / 9.0);
        #elif defined(SHADOWMAP_TYPE_PCF_SOFT)
        vec2 texelSize = vec2(1.0) / shadowMapSize;
        float dx0 = - texelSize.x * shadowRadius;
        float dy0 = - texelSize.y * shadowRadius;
        float dx1 = + texelSize.x * shadowRadius;
        float dy1 = + texelSize.y * shadowRadius;
        shadow = (
        texture2DShadowLerp(shadowMap, shadowMapSize, shadowCoord.xy + vec2(dx0, dy0), shadowCoord.z) +
        texture2DShadowLerp(shadowMap, shadowMapSize, shadowCoord.xy + vec2(0.0, dy0), shadowCoord.z) +
        texture2DShadowLerp(shadowMap, shadowMapSize, shadowCoord.xy + vec2(dx1, dy0), shadowCoord.z) +
        texture2DShadowLerp(shadowMap, shadowMapSize, shadowCoord.xy + vec2(dx0, 0.0), shadowCoord.z) +
        texture2DShadowLerp(shadowMap, shadowMapSize, shadowCoord.xy, shadowCoord.z) +
        texture2DShadowLerp(shadowMap, shadowMapSize, shadowCoord.xy + vec2(dx1, 0.0), shadowCoord.z) +
        texture2DShadowLerp(shadowMap, shadowMapSize, shadowCoord.xy + vec2(dx0, dy1), shadowCoord.z) +
        texture2DShadowLerp(shadowMap, shadowMapSize, shadowCoord.xy + vec2(0.0, dy1), shadowCoord.z) +
        texture2DShadowLerp(shadowMap, shadowMapSize, shadowCoord.xy + vec2(dx1, dy1), shadowCoord.z)
        ) * (1.0 / 9.0);
        #else
        shadow = texture2DCompare(shadowMap, shadowCoord.xy, shadowCoord.z);
        #endif
    }
    return shadow;
}
vec2 cubeToUV(vec3 v, float texelSizeY) {
    vec3 absV = abs(v);
    float scaleToCube = 1.0 / max(absV.x, max(absV.y, absV.z));
    absV *= scaleToCube;
    v *= scaleToCube * (1.0 - 2.0 * texelSizeY);
    vec2 planar = v.xy;
    float almostATexel = 1.5 * texelSizeY;
    float almostOne = 1.0 - almostATexel;
    if (absV.z >= almostOne) {
        if (v.z > 0.0)
        planar.x = 4.0 - v.x;
    } else if (absV.x >= almostOne) {
        float signX = sign(v.x);
        planar.x = v.z * signX + 2.0 * signX;
    } else if (absV.y >= almostOne) {
        float signY = sign(v.y);
        planar.x = v.x + 2.0 * signY + 2.0;
        planar.y = v.z * signY - 2.0;
    }
    return vec2(0.125, 0.25) * planar + vec2(0.375, 0.75);
}
float getPointShadow(sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar) {
    vec2 texelSize = vec2(1.0) / (shadowMapSize * vec2(4.0, 2.0));
    vec3 lightToPosition = shadowCoord.xyz;
    float dp = (length(lightToPosition) - shadowCameraNear) / (shadowCameraFar - shadowCameraNear);        dp += shadowBias;
    vec3 bd3D = normalize(lightToPosition);
    #if defined(SHADOWMAP_TYPE_PCF) || defined(SHADOWMAP_TYPE_PCF_SOFT)
    vec2 offset = vec2(- 1, 1) * shadowRadius * texelSize.y;
    return (
    texture2DCompare(shadowMap, cubeToUV(bd3D + offset.xyy, texelSize.y), dp) +
    texture2DCompare(shadowMap, cubeToUV(bd3D + offset.yyy, texelSize.y), dp) +
    texture2DCompare(shadowMap, cubeToUV(bd3D + offset.xyx, texelSize.y), dp) +
    texture2DCompare(shadowMap, cubeToUV(bd3D + offset.yyx, texelSize.y), dp) +
    texture2DCompare(shadowMap, cubeToUV(bd3D, texelSize.y), dp) +
    texture2DCompare(shadowMap, cubeToUV(bd3D + offset.xxy, texelSize.y), dp) +
    texture2DCompare(shadowMap, cubeToUV(bd3D + offset.yxy, texelSize.y), dp) +
    texture2DCompare(shadowMap, cubeToUV(bd3D + offset.xxx, texelSize.y), dp) +
    texture2DCompare(shadowMap, cubeToUV(bd3D + offset.yxx, texelSize.y), dp)
    ) * (1.0 / 9.0);
    #else
    return texture2DCompare(shadowMap, cubeToUV(bd3D, texelSize.y), dp);
    #endif
}
    #endif
//ShaderChunk shadowmask_pars_fragment
float getShadowMask() {
    float shadow = 1.0;
    #ifdef USE_SHADOWMAP
    #if NUM_DIR_LIGHTS > 0
    DirectionalLight directionalLight;
    #pragma unroll_loop
    for (int i = 0; i < NUM_DIR_LIGHTS; i ++) {
        directionalLight = directionalLights[i];
        shadow *= bool(directionalLight.shadow) ? getShadow(directionalShadowMap[i], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[i]) : 1.0;
    }
        #endif
        #if NUM_SPOT_LIGHTS > 0
    SpotLight spotLight;
    #pragma unroll_loop
    for (int i = 0; i < NUM_SPOT_LIGHTS; i ++) {
        spotLight = spotLights[i];
        shadow *= bool(spotLight.shadow) ? getShadow(spotShadowMap[i], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotShadowCoord[i]) : 1.0;
    }
        #endif
        #if NUM_POINT_LIGHTS > 0
    PointLight pointLight;
    #pragma unroll_loop
    for (int i = 0; i < NUM_POINT_LIGHTS; i ++) {
        pointLight = pointLights[i];
        shadow *= bool(pointLight.shadow) ? getPointShadow(pointShadowMap[i], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[i], pointLight.shadowCameraNear, pointLight.shadowCameraFar) : 1.0;
    }
        #endif
        #endif
    return shadow;
}
void main() {
    vec4 noise = getNoise(worldPosition.xz * size);
    vec3 surfaceNormal = normalize(noise.xzy * vec3(1.5, 1.0, 1.5));
    vec3 diffuseLight = vec3(0.0);
    vec3 specularLight = vec3(0.0);
    vec3 worldToEye = eye-worldPosition.xyz;
    vec3 eyeDirection = normalize(worldToEye);
    sunLight(surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight);
    float distance = length(worldToEye);
    vec2 distortion = surfaceNormal.xz * (0.001 + 1.0 / distance) * distortionScale;
    vec3 reflectionSample = vec3(texture2D(mirrorSampler, mirrorCoord.xy / mirrorCoord.w + distortion));
    float theta = max(dot(eyeDirection, surfaceNormal), 0.0);
    float rf0 = 0.3;
    float reflectance = rf0 + (1.0 - rf0) * pow((1.0 - theta), 5.0);
    vec3 scatter = max(0.0, dot(surfaceNormal, eyeDirection)) * waterColor;
    vec3 albedo = mix((sunColor * diffuseLight * 0.3 + scatter) * getShadowMask(), (vec3(0.1) + reflectionSample * 0.9 + reflectionSample * specularLight), reflectance);
    vec3 outgoingLight = albedo;
    gl_FragColor = vec4(outgoingLight, alpha);

    //ShaderChunk tonemapping_fragment
    #if defined(TONE_MAPPING)
    gl_FragColor.rgb = toneMapping(gl_FragColor.rgb);
    #endif

    //ShaderChunk fog_fragment
    #ifdef USE_FOG
    #ifdef FOG_EXP2
    float fogFactor = whiteCompliment(exp2(- fogDensity * fogDensity * fogDepth * fogDepth * LOG2));
    #else
    float fogFactor = smoothstep(fogNear, fogFar, fogDepth);
    #endif
    gl_FragColor.rgb = mix(gl_FragColor.rgb, fogColor, fogFactor);
    #endif
}
