import { Application, Sprite, Container, Loader, Texture } from 'pixi.js';
import AsciiFilter from 'Ascii/AsciiFilter';
import GlitchEmisorFilter from 'Glitch/GlitchEmisorFilter';

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

const glitch = new GlitchEmisorFilter();
let sprite: Sprite;
let texture: Texture;
function main(loader: Loader, resources: any) {
  const conty: Container = new Container();
  conty.x = 0;
  conty.y = 0;
  app.stage.addChild(conty);

  const media = resources.thomas.data as any;

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

  const ascii = new AsciiFilter();

  sprite.filters = [ascii, glitch];
  conty.addChild(sprite);
}

app.loader.add(assets).load(main);

let prevX = 0;
let prevY = 0;

function onMouseEnter() {
  glitch.startGlitch(5000, 0.01);
}

function onMouseMove(event) {
  prevX = event.pageX;
  prevY = event.pageY;
}

function onMouseLeave() {
  glitch.stopGlitch();
}

document.addEventListener('mousemove', onMouseMove, false);
document.addEventListener('mouseleave', onMouseLeave, false);
document.addEventListener('mouseenter', onMouseEnter, false);

window.onresize = () => {
  sprite.scale.x = canvas.clientWidth / texture.width;
  sprite.scale.y = canvas.clientWidth / texture.width;
};
