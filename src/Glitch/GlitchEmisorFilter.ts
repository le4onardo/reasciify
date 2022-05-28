import { GlitchFilter, GlitchFilterOptions } from '@pixi/filter-glitch';
import Repeater from './Repeater';

export default class GlitchEmisorFilter extends GlitchFilter {
  private maxOptionsRanges: Partial<GlitchFilterOptions>;
  private repeater: Repeater;

  constructor(
    options?: Partial<GlitchFilterOptions>,
    maxOptionsRanges?: Partial<GlitchFilterOptions>
  ) {
    super(options);
    this.maxOptionsRanges = maxOptionsRanges || {};
    this.repeater = new Repeater();
  }

  private getRandomSlices(intensity: number = 1) {
    const range =
      this.maxOptionsRanges.slices || this.uniforms.dimensions[1] / 2;
    return Math.round(range * Math.random() * intensity);
  }

  private getRandomOffset(intensity: number = 1) {
    const range =
      this.maxOptionsRanges.offset || this.uniforms.dimensions[0] / 2;
    return Math.round(range * Math.random() * intensity);
  }

  private getRandomRed(intensity: number = 1) {
    const rangeX = this.maxOptionsRanges.red
      ? this.maxOptionsRanges.red[0]
      : this.uniforms.dimensions[0] / 2;

    const rangeY = this.maxOptionsRanges.red
      ? this.maxOptionsRanges.red[1]
      : this.uniforms.dimensions[1] / 2;

    return [
      Math.round(
        rangeX * Math.random() * (Math.random() < 0.5 ? 1 : -1) * intensity
      ),
      Math.round(
        rangeY * Math.random() * (Math.random() < 0.5 ? 1 : -1) * intensity
      )
    ];
  }

  private getRandomGreen(intensity: number = 1) {
    const rangeX = this.maxOptionsRanges.green
      ? this.maxOptionsRanges.green[0]
      : this.uniforms.dimensions[0] / 2;

    const rangeY = this.maxOptionsRanges.green
      ? this.maxOptionsRanges.green[1]
      : this.uniforms.dimensions[1] / 2;

    return [
      Math.round(
        rangeX * Math.random() * (Math.random() < 0.5 ? 1 : -1) * intensity
      ),
      Math.round(
        rangeY * Math.random() * (Math.random() < 0.5 ? 1 : -1) * intensity
      )
    ];
  }

  private getRandomBlue(intensity: number = 1) {
    const rangeX = this.maxOptionsRanges.blue
      ? this.maxOptionsRanges.blue[0]
      : this.uniforms.dimensions[0] / 2;

    const rangeY = this.maxOptionsRanges.blue
      ? this.maxOptionsRanges.blue[1]
      : this.uniforms.dimensions[1] / 2;

    return [
      Math.round(
        rangeX * Math.random() * (Math.random() < 0.5 ? 1 : -1) * intensity
      ),
      Math.round(
        rangeY * Math.random() * (Math.random() < 0.5 ? 1 : -1) * intensity
      )
    ];
  }

  public applyRandomGlitch = (intensity: number = 1) => {
    this.offset = this.getRandomOffset(intensity);

    this.red = this.getRandomRed(intensity);
    this.blue = this.getRandomBlue(intensity);
    this.green = this.getRandomGreen(intensity);
    this.slices = this.getRandomSlices(intensity);
  };

  public startGlitch(duration = 0, intensity: number = 1) {
    this.repeater.start(() => this.applyRandomGlitch(intensity), duration);
  }

  public stopGlitch() {
    this.repeater.stop();
  }
}
