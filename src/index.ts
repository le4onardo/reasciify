import sourceVideo from 'media/videos/video1.mp4';
import Grid from 'Grid';

// '../videos/190301_1_25_11.mp4';
// '../videos/Earth_Zoom_in.mov';

const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d');
ctx.textBaseline = 'top';
const fontSize = 20;
ctx.font = `ultra-expanded ${fontSize}px /1 arial`;
const video = document.createElement('video') as HTMLVideoElement;
video.controls = true;
video.crossOrigin = 'anonymous';
video.muted = true;
video.loop = true;
video.src = sourceVideo;
// 'https://mdn.github.io/dom-examples/canvas/chroma-keying/media/video.mp4';
// 'http://jplayer.org/video/webm/Finding_Nemo_Teaser.webm';
// 'http://jplayer.org/video/webm/Incredibles_Teaser.webm';
// 'http://jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm';

const image = new Image();
image.crossOrigin = '';
image.src =
  'https://static.remove.bg/remove-bg-web/b27c50a4d669fdc13528397ba4bc5bd61725e4cc/assets/start_remove-c851bdf8d3127a24e2d137a55b1b427378cd17385b01aec6e59d5d4b5f39d2ec.png';

let width: number;
let height: number;

const chars = '.,:;i1tfLCG8#@';

const onCharAreaFound = function (areaData: number[], px: number, py: number) {
  ctx.fillStyle = `rgb(
    ${Math.round(areaData[0])},
    ${Math.round(areaData[1])},
    ${Math.round(areaData[2])}
    )`;

  const selectedChar = chars.charAt(
    Math.floor(
      ((areaData[0] + areaData[1] + areaData[2]) / 3 / 256) * chars.length
    )
  );
  ctx.fillText(selectedChar, px, py);
};

const computeFrame = function computeFrame(
  media: HTMLImageElement | HTMLVideoElement
) {
  ctx.drawImage(media, 0, 0, width, height);

  const frame = ctx.getImageData(0, 0, width, height);
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  const { data } = frame;

  const grid = new Grid(data, width, height, 0, 0, width, height);
  grid.iterate(fontSize, onCharAreaFound);
};

const timerCallback = function () {
  if (video.paused || video.ended) {
    return;
  }
  computeFrame(video);
  setTimeout(() => {
    timerCallback();
  }, 0);
};

video.addEventListener(
  'loadedmetadata',
  function () {
    width = this.videoWidth;
    height = this.videoHeight;
    console.log(width, height);
    timerCallback();
  },
  false
);

video.play();

/*
image.decode().then(() => {
  width = image.naturalWidth;
  height = image.naturalHeight;
  console.log(width, height);
  computeFrame(image);
});
*/
