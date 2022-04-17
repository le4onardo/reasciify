import { GlitchFilter, GlitchFilterOptions } from '@pixi/filter-glitch';
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
    this.setOptionsLevels(0);
  }

  public applyRandomOptions() {
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
  }

  public setOptionsLevels(levels: number | OptionLevels) {
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
}
