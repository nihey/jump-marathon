import imageLoad from 'image-load';

import Camera from 'camera';
import Spawner from 'spawner';
import StaticEntity from 'entities/static';
import Sprite from 'entities/sprite';
import Timer from 'timer';

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

  window.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) {
      character.jump();
    }
  });

  let character = woman;
  let timer = new Timer();
  function loop() {
    window.elapsed = timer.elapsed();
    var moveCamera = true;

    context.clearRect(0, 0, canvas.width, canvas.height);

    character.polygon.physics();
    let platforms = spawner.spawned;
    for (let i = 0; i < platforms.length; ++i) {
      platforms[i].render(context);

      if (character.collides(platforms[i])) {
        let motion = character.polygon.motion;

        character.move(0, -motion.y);
        if (!character.collides(platforms[i])) {
          character.polygon.speed.y = 0;
          continue;
        }

        character.move(-motion.x, motion.y);
        moveCamera = false;
        if (!character.collides(platforms[i])) {
          continue;
        }

        character.polygon.speed.y = 0;
        character.move(0, -motion.y);
      }
    }

    character.draw(context);

    moveCamera && window.camera.physics();

    timer.reset();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
