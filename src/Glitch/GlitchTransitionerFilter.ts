import { GlitchFilter, GlitchFilterOptions } from '@pixi/filter-glitch';

export default class GlitchTransitionerFilter extends GlitchFilter {
  // public endOptions: Partial<GlitchFilterOptions>;

  constructor(
    private startOptions: Partial<GlitchFilterOptions> = {
      offset: 0,
      direction: 0,
      red: [0, 0],
      green: [0, 0],
      blue: [0, 0],
      slices: 0
    }
  ) {
    super({
      ...startOptions,
      red: [startOptions.red[0], startOptions.red[1]],
      green: [startOptions.green[0], startOptions.green[1]],
      blue: [startOptions.blue[0], startOptions.blue[1]]
    });
  }

  private async transition(
    offset,
    red,
    green,
    blue,
    slices,
    time: number
  ): Promise<unknown> {
    const redEpsilons = [
      (red[0] - this.red[0]) / time,
      (red[1] - this.red[1]) / time
    ];
    const greenEpsilons = [
      (green[0] - this.green[0]) / time,
      (green[1] - this.green[1]) / time
    ];
    const blueEpsilons = [
      (blue[0] - this.blue[0]) / time,
      (blue[1] - this.blue[1]) / time
    ];
    const offsetEpsilon = (offset - this.offset) / time;
    const slicesEpsilon = (slices - this.slices) / time;
    let slicesCopy = this.slices;
    let resolve;

    const promise = new Promise(res => {
      resolve = res;
    });

    const nextFrame = counter => {
      if (counter <= 0) {
        this.offset = offset;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.slices = slices;
        resolve();
        return;
      }

      this.offset += offsetEpsilon;
      this.red[0] += redEpsilons[0];
      this.red[1] += redEpsilons[1];
      this.green[0] += greenEpsilons[0];
      this.green[1] += greenEpsilons[1];
      this.blue[0] += blueEpsilons[0];
      this.blue[1] += blueEpsilons[1];
      slicesCopy += slicesEpsilon;
      this.slices =
        Math.ceil(slicesCopy) === this.slices
          ? this.slices - 1
          : Math.ceil(slicesCopy);
      setTimeout(() => nextFrame(counter - 1));
    };

    nextFrame(time);
    return promise;
  }

  public async animate(
    options: Partial<GlitchFilterOptions>,
    time: number = 0
  ): Promise<unknown> {
    return this.transition(
      options.offset,
      options.red,
      options.green,
      options.blue,
      options.slices,
      time
    );
  }
}
