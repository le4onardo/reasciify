
// this is just for code highlighting in VSCode
// via the glsl-literal extension
const glsl = x => x;

const frag = glsl`
precision highp float;

uniform float width;
uniform float height;

uniform sampler2D camTexture;
uniform sampler2D fontTexture;
uniform sampler2D lumTexture;

const int zoom = 1;

vec4 grey(vec4 color) {
  float val = (color.x + color.y + color.z) / 3.0;
  return vec4(vec3(val), 1.0);
}

vec2 getTexCoords(vec2 position) {
  return 1.0 - position.xy / vec2(width, height);
}

vec2 camCoord(vec2 coord) {
  return 1.0 - coord / vec2(width, height);
} 


vec2 getFontCoord(int i) {
  float chY = floor(float(i) / 16.);
  float chX = mod(float(i), 16.);
  vec2 fontCoord = vec2((chX * 8. + mod(gl_FragCoord.x / float(zoom), 8.)) / 128., (chY * 8. + (8. - mod(gl_FragCoord.y / float(zoom), 8.))) / 128.);
  return fontCoord;
}

vec2 getLumCoord(in int i, in vec2 p) {
  float chY = floor(float(i) / 16.);
  float chX = mod(float(i), 16.);
  vec2 lumCoord = vec2((chX * 2. + p.x) / 32., (chY * 2. + 2. - p.y) / 32.);

  return lumCoord;
}


vec4 averageBlockColor() {
  vec2 a = floor(gl_FragCoord.xy / (float(zoom) * 8.)) * float(zoom) * 8.;
  vec2 b = a + vec2(4, 0) * float(zoom);
  vec2 c = b + vec2(0, 4) * float(zoom);
  vec2 d = c + vec2(4, 4) * float(zoom);
  
  vec4 p0 = texture2D(camTexture, camCoord(a));
  vec4 p1 = texture2D(camTexture, camCoord(b));
  vec4 p2 = texture2D(camTexture, camCoord(c));
  vec4 p3 = texture2D(camTexture, camCoord(d));
  
  vec4 c0 =  grey(p0);
  vec4 c1 =  grey(p1);
  vec4 c2 =  grey(p2);
  vec4 c3 =  grey(p3);

  float minDist = 9999.;
  int minIdx = 32;
  for (int i = 32; i < 127; i++) {
    vec4 l0 = texture2D(lumTexture, getLumCoord(i, vec2(0. ,0.)));
    vec4 l1 = texture2D(lumTexture, getLumCoord(i, vec2(1. ,0.)));
    vec4 l2 = texture2D(lumTexture, getLumCoord(i, vec2(0. ,1.)));
    vec4 l3 = texture2D(lumTexture, getLumCoord(i, vec2(1. ,1.)));
    float dist = length(vec4(
      c0.x - l0.x,
      c1.x - l1.x,
      c2.x - l2.x,
      c3.x - l3.x
    ));
    if (dist < minDist) {
      minIdx = i;
      minDist = dist;
    }
  }
  vec2 fontCoord = getFontCoord(minIdx);
  vec4 fontColors = texture2D(fontTexture, fontCoord);
  
    if(grey(fontColors).x < 0.5) {
      return fontColors;
    }  
  return (p0+p1+p2+p3)/4.0;
}

void main() {
  gl_FragColor = averageBlockColor(); 
}
`;

const vert = glsl`
precision mediump float;
attribute vec2 position;

void main () {
  gl_Position = vec4(position, 0, 1.0);
}
`;

let video = document.querySelector('video');
let fallbackImage = null;

let camTexture = null;
let fontTexture = null;
let lumTexture = null;

const glea = new GLea({
  glOptions: {
    preserveDrawingBuffer: true
  },
  shaders: [GLea.fragmentShader(frag), GLea.vertexShader(vert)],
  buffers: {
    position: GLea.buffer(2, [1, 1, -1, 1, 1, -1, -1, -1])
  }
}).create();

window.addEventListener('resize', () => {
  glea.resize();
});

function loop(time) {
  const { gl } = glea;
  // Upload the image into the texture.
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video || fallbackImage);
  if (video) {
    glea.setActiveTexture(0, camTexture);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, gl.RGBA, gl.UNSIGNED_BYTE, video);
  }

  glea.clear();
  glea.uni('width', glea.width);
  glea.uni('height', glea.height);
  glea.uni('time', time * 0.005);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  requestAnimationFrame(loop);
}

function accessWebcam(video) {
  return new Promise((resolve, reject) => {
    const mediaConstraints = {
      audio: false,
      video: { width: 1280, height: 720, brightness: { ideal: 2 } }
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(mediaStream => {
        video.srcObject = mediaStream;
        video.setAttribute('playsinline', true);
        video.onloadedmetadata = e => {
          video.play();
          resolve(video);
        };
      })
      .catch(err => {
        reject(err);
      });
  });
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = url;
    img.onload = () => {
      resolve(img);
    };
    img.onerror = () => {
      reject(img);
    };
  });
}

function takeScreenshot() {
  const { canvas } = glea;
  const anchor = document.createElement('a');
  anchor.setAttribute('download', 'selfie.jpg');
  anchor.setAttribute('href', canvas.toDataURL('image/jpeg', 0.92));
  anchor.click();
}

async function setup() {
  const { gl } = glea;
  try {
    await accessWebcam(video);
  } catch (ex) {
    video = null;
    console.error(ex.message);
  }
  // video = null;
  if (!video) {
    try {
      fallbackImage = await loadImage('https://placekitten.com/1280/720');
    } catch (ex) {
      console.error(ex.message);
      return false;
    }
  }

  const [fontImage, lumImage] = await Promise.all([
    loadImage(fontURL),
    loadImage(luminanceMapURL)
  ]);

  camTexture = glea.createTexture(0);
  // Upload the image into the texture.
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    video || fallbackImage
  );

  fontTexture = glea.createTexture(1);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    fontImage
  );

  lumTexture = glea.createTexture(2);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, lumImage);

  glea.setActiveTexture(0, camTexture);

  glea.uniI('camTexture', 0);
  glea.uniI('fontTexture', 1);
  glea.uniI('lumTexture', 2);
  loop(0);
}

setup();
