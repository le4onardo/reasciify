import { GlitchFilter, GlitchFilterOptions } from '@pixi/filter-glitch';
import Repeater from './Repeater';
// import GlitchTransitionerFilter from './GlitchTransitionerFilter';

interface OptionLevels {
  offsetLevel?: number;
  redLevels?: number[];
  greenLevels?: number[];
  blueLevels?: number[];
  slicesLevel?: number;
}

export default class GlitchEmisorFilter extends GlitchFilter {
  private maxOptionsRanges: Partial<GlitchFilterOptions>;
  private optionLevels: OptionLevels;
  private repeater: Repeater;

  constructor(
    options?: Partial<GlitchFilterOptions>,
    maxOptionsRanges: Partial<GlitchFilterOptions> = {
      offset: 500,
      red: [100, 100],
      green: [100, 100],
      blue: [100, 100],
      slices: 3000
    }
  ) {
    super(options);
    this.maxOptionsRanges = maxOptionsRanges;
    this.setIntensityLevels(0);
    this.repeater = new Repeater();
  }

  public getSlicesRange() {
    return (
      (this.maxOptionsRanges.slices || this.uniforms[1] / 2) * Math.random()
    );
  }

  public getOffsetRange() {
    return (
      (this.maxOptionsRanges.offset || this.uniforms[0] / 2) * Math.random()
    );
  }

  public getRedRange() {
    return [
      (this.maxOptionsRanges.red[0] || this.uniforms[0] / 2) * Math.random(),
      (this.maxOptionsRanges.red[1] || this.uniforms[1] / 2) * Math.random()
    ];
  }

  public getGreenRange() {
    return [
      (this.maxOptionsRanges.green[0] || this.uniforms[0] / 2) * Math.random(),
      (this.maxOptionsRanges.green[1] || this.uniforms[1] / 2) * Math.random()
    ];
  }

  public getBlueRange() {
    return [
      (this.maxOptionsRanges.blue[0] || this.uniforms[0] / 2) * Math.random(),
      (this.maxOptionsRanges.blue[1] || this.uniforms[1] / 2) * Math.random()
    ];
  }

  public applyRandomGlitch = () => {
    const { offsetLevel, redLevels, greenLevels, blueLevels, slicesLevel } =
      this.optionLevels;
    const random = Math.random();
    this.offset = Math.round(
      offsetLevel * this.maxOptionsRanges.offset * random
    );
    this.red = [
      Math.round(redLevels[0] * random * this.maxOptionsRanges.red[0]) *
        (Math.random() < 0.5 ? -1 : 1),
      Math.round(redLevels[1] * random * this.maxOptionsRanges.red[1]) *
        (Math.random() < 0.5 ? -1 : 1)
    ];
    this.blue = [
      Math.round(blueLevels[0] * random * this.maxOptionsRanges.blue[0]) *
        (Math.random() < 0.5 ? -1 : 1),
      Math.round(blueLevels[1] * random * this.maxOptionsRanges.blue[1]) *
        (Math.random() < 0.5 ? -1 : 1)
    ];
    this.green = [
      Math.round(greenLevels[0] * random * this.maxOptionsRanges.green[0]) *
        (Math.random() < 0.5 ? -1 : 1),
      Math.round(greenLevels[1] * random * this.maxOptionsRanges.green[1]) *
        (Math.random() < 0.5 ? -1 : 1)
    ];
    this.slices = Math.round(
      slicesLevel * random * this.maxOptionsRanges.slices
    );
  };

  public setIntensityLevels(levels: number | OptionLevels = 0) {
    if (typeof levels === 'number') {
      this.optionLevels = {
        offsetLevel: levels,
        redLevels: [levels, levels],
        greenLevels: [levels, levels],
        blueLevels: [levels, levels],
        slicesLevel: levels
      };
    } else {
      this.optionLevels = { ...this.optionLevels, ...levels };
    }
  }

  public startGlitch(duration = 0) {
    this.repeater.start(this.applyRandomGlitch, duration);
  }

  public stopGlitch() {
    this.repeater.stop();
    this.setIntensityLevels(0);
  }
}
