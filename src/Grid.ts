export default class Grid {
  constructor(
    private buffer: Uint8ClampedArray,
    private width: number,
    private height: number,
    private sx: number,
    private sy: number,
    private sw: number,
    private sh: number
  ) {
    this.buffer = buffer;
    this.width = width;
    this.height = height;
    this.sx = sx;
    this.sy = sy;
    this.sw = sw;
    this.sh = sh;
  }

  public iterate(fontSize: number, onCharAreaFound: Function) {
    for (let i = this.sy; i < this.sh; i += fontSize) {
      for (let j = this.sx; j < this.sw; j += fontSize) {
        // const areaData = this.iterateCharRegion(j, i, 1);

        onCharAreaFound(
          [
            this.buffer[(i * this.width + j) * 4],
            this.buffer[(i * this.width + j) * 4 + 1],
            this.buffer[(i * this.width + j) * 4 + 2],
            this.buffer[(i * this.width + j) * 4 + 3]
          ],
          j,
          i
        );
      }
    }
  }

  private iterateCharRegion(px: number, py: number, fontSize: number) {
    const averagePixelsInfo = [0, 0, 0, 0];
    for (let j = py; j < py + fontSize && py < this.height; j += 1) {
      for (let i = px; i < px + fontSize && px < this.width; i += 1) {
        averagePixelsInfo[0] += this.buffer[(j * this.width + i) * 4];
        averagePixelsInfo[1] += this.buffer[(j * this.width + i) * 4 + 1];
        averagePixelsInfo[2] += this.buffer[(j * this.width + i) * 4 + 2];
        averagePixelsInfo[3] += this.buffer[(j * this.width + i) * 4 + 3];
      }
    }

    return averagePixelsInfo.map(p => p / (fontSize * fontSize));
  }
}
