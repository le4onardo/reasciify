// import { vertex } from '@tools/fragments';
import { Filter } from '@pixi/core';
import { Texture, MIPMAP_MODES } from 'pixi.js';
import fontMap from 'Ascii/fontMap.png';

// TODO (cengler) - The Y is flipped in this shader for some reason.

// @author Vico @vicocotea
// original shader : https://www.shadertoy.com/view/lssGDj by @movAX13h

/**
 * An ASCII filter.<br>
 * ![original](../tools/screenshots/dist/original.png)![filter](../tools/screenshots/dist/ascii.png)
 *
 * @class
 * @extends PIXI.Filter
 * @memberof PIXI.filters
 * @see {@link https://www.npmjs.com/package/@pixi/filter-ascii|@pixi/filter-ascii}
 * @see {@link https://www.npmjs.com/package/pixi-filters|pixi-filters}
 */

const vertex = `  attribute vec2 aVertexPosition;
   attribute vec2 aTextureCoord;
   uniform mat3 projectionMatrix;
   varying vec2 vTextureCoord;
   void main(void) {
        gl_Position =  vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
        vTextureCoord = aTextureCoord;
    }`;

const fragment = `
precision highp float;
uniform sampler2D uSampler;
uniform sampler2D fontTexture;
uniform vec4 inputPixel;
uniform int charIndexes[16]; 

float width = inputPixel.x;
float height = inputPixel.y;
const int zoom = 1;

vec2 sampleCoord(vec2 coord) {
  return coord / vec2(width, height);
}

vec2 getFontCoord(int i, vec4 coord) {
  float chY = floor(float(i) / 16.);
  float chX = mod(float(i), 16.);
  vec2 fontCoord = vec2((chX * 8. + mod(coord.x / float(zoom), 8.)) / 128., (chY * 8. + (8. - mod((-coord.y) / float(zoom), 8.))) / 128.);
  return fontCoord;
}

float averageBlockColor(vec4 coord) {
  vec2 topLeftCoord = floor(coord.xy / (float(zoom) * 8.)) * float(zoom) * 8.;
  vec4 topLeftColor = texture2D(uSampler, sampleCoord(topLeftCoord));  
  float charIndex = floor(((topLeftColor.x + topLeftColor.y + topLeftColor.z) / 3.0) * 15.0);

  int minIdx = charIndexes[0];
  if (charIndex == 1.0) minIdx = charIndexes[1];
  if (charIndex == 2.0) minIdx = charIndexes[2];
  if (charIndex == 3.0) minIdx = charIndexes[3];
  if (charIndex == 4.0) minIdx = charIndexes[4];
  if (charIndex == 5.0) minIdx = charIndexes[5];
  if (charIndex == 6.0) minIdx = charIndexes[6];
  if (charIndex == 7.0) minIdx = charIndexes[7];
  if (charIndex == 8.0) minIdx = charIndexes[8];
  if (charIndex == 9.0) minIdx = charIndexes[9];
  if (charIndex == 10.0) minIdx = charIndexes[10];
  if (charIndex == 11.0) minIdx = charIndexes[11];
  if (charIndex == 12.0) minIdx = charIndexes[12];
  if (charIndex == 13.0) minIdx = charIndexes[13];
  if (charIndex == 14.0) minIdx = charIndexes[14];
  if (charIndex == 15.0) minIdx = charIndexes[15];

  
  vec2 fontCoord = getFontCoord(minIdx, coord);
  vec4 fontColors = texture2D(fontTexture, fontCoord);
  if ((fontColors.x + fontColors.y + fontColors.z) / 3.0 < 0.5) return 0.0;
  return 1.0; 
}

void main() {
  vec4 coord = gl_FragCoord;

  gl_FragColor =  texture2D(uSampler, sampleCoord(coord.xy)) * averageBlockColor(coord);
}`;

class AsciiFilter extends Filter {
  /**
   * @param {number} [size=8] - Size of the font
   */
  constructor(size) {
    super(vertex, fragment);
    this.size = size || 8;
    this.fontTexture = Texture.from(fontMap, { mipmap: MIPMAP_MODES.OFF });
    //-'"^\]on3b&HAB@0
    // Ascii value
    this.charIndexes = [
      45, 96, 34, 94, 92, 93, 111, 110, 51, 98, 38, 72, 65, 66, 64, 48
    ];
  }

  /**
   * The pixel size used by the filter.
   */
  get size(): number {
    return this.uniforms.pixelSize;
  }

  set size(value: number) {
    this.uniforms.pixelSize = value;
  }

  get fontTexture() {
    return this.uniforms.fontTexture;
  }

  set fontTexture(value: Texture) {
    this.uniforms.fontTexture = value;
  }

  set charIndexes(value: number[]) {
    this.uniforms.charIndexes = value;
  }
}

export { AsciiFilter };
