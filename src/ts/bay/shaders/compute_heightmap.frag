#include <common>

uniform vec2 wavePos;
uniform float waveSize;
uniform float viscosityConstant;

void main() {
    vec2 cellSize = 1.0 / resolution.xy;

    vec2 uv = gl_FragCoord.xy * cellSize;

    // heightmapValue.x == height from previous frame
    // heightmapValue.y == height from penultimate frame
    // heightmapValue.z, heightmapValue.w not used
    vec4 heightmapValue = texture2D(heightmap, uv);

    // Get neighbours
    vec4 north = texture2D(heightmap, uv + vec2(0.0, cellSize.y));
    vec4 south = texture2D(heightmap, uv + vec2(0.0, - cellSize.y));
    vec4 east = texture2D(heightmap, uv + vec2(cellSize.x, 0.0));
    vec4 west = texture2D(heightmap, uv + vec2(- cellSize.x, 0.0));

    // https://web.archive.org/web/20080618181901/http://freespace.virgin.net/hugo.elias/graphics/x_water.htm

    float newHeight = ((north.x + south.x + east.x + west.x) * 0.5 - heightmapValue.y) * viscosityConstant;

    // Mouse influence
    float mousePhase = clamp(length((uv - vec2(0.5)) * BOUNDS - vec2(wavePos.x, - wavePos.y)) * PI / waveSize, 0.0, PI);
    newHeight += (cos(mousePhase) + 1.0) * 0.28;

    heightmapValue.y = heightmapValue.x;
    heightmapValue.x = newHeight;

    gl_FragColor = heightmapValue;

}
