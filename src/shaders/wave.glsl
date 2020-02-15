#ifndef PI
#define PI 3.14159265359
#endif

#define WAVE_SCALE .1
#define WAVE_WIDTH (1.5 * PI)
#define WAVE_MAX_DISTANCE = 9.

float getWave(const in vec2 vPosition, const in vec2 vWaveSource, const in float fWaveStrength, const in float fTime) {
    // distance of point and source of wave
    float dist = WAVE_SCALE * distance(vPosition, vWaveSource);

    // wave speed
    float speed = max(WAVE_WIDTH * fTime - dist, .0);

    // amplitude without downturn
    float amplitude = sin(pow(speed, 2.));

    // energy downturn
    float k1 = fWaveStrength * max(1. - speed / WAVE_WIDTH, .0);

    // downturn caused by water density
    // this probably should be some kind of logarithm of 1 / x
    float k2 = max(1. - (dist / 9.), .0);

    return amplitude * k1 * k2;
}

vec4 getWavePositionAndNormal(const in vec2 vPosition, const in vec2 vWaveSource, const in float fWaveStrength, const in float fTime, out vec3 vNormal) {
    vec4 vPos = vec4(vPosition, getWave(vPosition, vWaveSource, fWaveStrength, fTime), 1.0);

    vec2 vN1xy = vec2(vPosition.x + .1, vPosition.y);
    vec3 vNeighbour1 = vec3(vN1xy, getWave(vN1xy, vWaveSource, fWaveStrength, fTime));

    vec2 vN2xy = vec2(vPosition.x, vPosition.y + .1);
    vec3 vNeighbour2 = vec3(vN2xy, getWave(vN2xy, vWaveSource, fWaveStrength, fTime));

    vNormal = normalize(cross(vNeighbour1 - vPos.xyz, vNeighbour2 - vPos.xyz));

    return vPos;
}

