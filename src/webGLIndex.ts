import { Application, Sprite, Container, Loader, Texture } from 'pixi.js';
import { AsciiFilter } from 'Ascii/AsciiFilter';
import GlitchEmisorFilter from 'Glitch/GlitchEmisorFilter';
import { GlitchFilter } from '@pixi/filter-glitch';

import assets from 'assets';

const canvas = document.createElement('canvas') as HTMLCanvasElement;
document.getElementsByTagName('body')[0].appendChild(canvas);
canvas.width = 1000;
const app = new Application({
  view: canvas,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x000000,
  resizeTo: window,
  width: 1000,
  height: 1000
});

const glitch = new GlitchEmisorFilter({ minSize: 2 });
let sprite: Sprite;
let texture: Texture;
function main(loader: Loader, resources: any) {
  const conty: Container = new Container();
  conty.x = 0;
  conty.y = 0;
  app.stage.addChild(conty);

  const media = resources.gray.data as any;

  if (media.nodeName === 'VIDEO') {
    media.muted = true;
    media.autoplay = true;
    media.loop = true;
  }

  texture = Texture.from(media);
  sprite = new Sprite(texture);
  sprite.x = 0;
  sprite.y = 0;
  sprite.scale.x = canvas.clientWidth / texture.width;
  sprite.scale.y = canvas.clientWidth / texture.width;

  console.log(canvas.clientWidth, canvas.clientHeight);
  console.log(texture.width, texture.height);
  console.log(sprite.width, sprite.height);
  console.log(window.innerWidth, window.innerHeight);

  const ascii = new AsciiFilter(60);

  sprite.filters = [ascii, glitch];
  conty.addChild(sprite);
}

app.loader.add(assets).load(main);

app.ticker.add(() => {
  glitch.applyRandomOptions();
});

let prevX = 0;
let prevY = 0;
function onMouseMove(event) {
  glitch.setOptionsLevels(
    (Math.abs(event.pageX - prevX) + Math.abs(event.pageY - prevY)) / 500
  );
  prevX = event.pageX;
  prevY = event.pageY;
}
function onMouseLeave() {
  glitch.setOptionsLevels(0.0);
}

document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mouseleave', onMouseLeave, false);

window.onresize = () => {
  sprite.scale.x = canvas.clientWidth / texture.width;
  sprite.scale.y = canvas.clientWidth / texture.width;
};
