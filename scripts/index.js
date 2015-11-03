import imageLoad from 'image-load';

import Camera from 'camera';
import Spawner from 'spawner';
import StaticEntity from 'entities/static';

imageLoad([require('../assets/images/platform.png')], function(platform) {
  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');
  window.camera = new Camera(canvas);
  window.camera.speed.x = 0.2;

  let spawner = new Spawner(
    [new StaticEntity(platform)]
  );
  spawner.start();

  function loop() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    window.camera.physics();

    let platforms = spawner.spawned;
    for (let i = 0; i < platforms.length; ++i) {
      platforms[i].render(context);
    }

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
