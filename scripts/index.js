import imageLoad from 'image-load';

import Camera from 'camera';
import Entity from 'entities/static';

imageLoad([require('../assets/images/platform.png')], function(platform) {
  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');
  window.camera = new Camera(canvas);
  window.camera.speed.x = 0.2;

  let platform1 = new Entity(platform, 400, 0);
  let platform2 = new Entity(platform, 300, 0);
  let platform3 = new Entity(platform, 200, 0);
  platform = new Entity(platform, 500, 0);

  function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    window.camera.physics();
    platform.render(context);
    platform1.render(context);
    platform2.render(context);
    platform3.render(context);
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
