import video1 from 'media/videos/video1.mp4';
import thomas from 'media/images/Thomas_Tank_Engine_1.jpeg';
import gray from 'media/images/gray_gradient.jpg';
import video2 from 'media/videos/video2.mp4';
import video3 from 'media/videos/Earth_Zoom_In.mp4';

export default [
  { name: 'thomas', url: thomas, crossOrigin: true },
  { name: 'gray', url: gray, crossOrigin: true },
  { name: 'video1', url: video1, crossOrigin: true },
  { name: 'video2', url: video2 },
  { name: 'video3', url: video3 },
  {
    name: 'video4',
    url: 'http://jplayer.org/video/webm/Finding_Nemo_Teaser.webm',
    crossOrigin: true
  },
  {
    name: 'video5',
    url: 'http://jplayer.org/video/webm/Big_Buck_Bunny_Trailer.webm',
    crossOrigin: true
  }
];
