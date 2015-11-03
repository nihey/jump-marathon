import imageLoad from 'image-load';

import Camera from 'camera';
import Spawner from 'spawner';
import StaticEntity from 'entities/static';
import Sprite from 'entities/sprite';

imageLoad([
    require('../assets/images/platform.png'),
    require('../assets/images/woman.png'),
    require('../assets/images/man.png'),
  ], function(platform, woman, man) {
  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');
  window.camera = new Camera(canvas);
  window.camera.speed.x = 0.2;

  let settings = [
    (canvas.width / 3) - 16, (canvas.height / 2) - 16, 32, 32,
    [
      [0, 64, 32, 32],
      [32, 64, 32, 32],
      [64, 64, 32, 32],
    ], 10
  ];

  woman = new Sprite(woman, ...settings);
  woman.polygon.speed.x = 0.2;
  woman.indexes = [0, 1, 2, 1];
  man = new Sprite(man, ...settings);

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

    woman.render(context);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
