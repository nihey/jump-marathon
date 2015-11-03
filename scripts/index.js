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

  function generate() {
    let canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = platform.height;

    let context = canvas.getContext('2d');
    let platforms = {};

    function getEntity() {
      let image = new Image();
      image.src = canvas.toDataURL();


      return new StaticEntity(image, 0, 0, image.width, image.height, 0, 32);
    }

    // Clip each side of the platform
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(platform, 0, 0);
    platforms.left = getEntity();

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(platform, 32, 0, 32, canvas.height, 0, 0, canvas.width, canvas.height);
    platforms.middle = getEntity();

    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(platform, 64, 0, 32, canvas.height, 0, 0, canvas.width, canvas.height);
    platforms.right = getEntity();

    let length = Math.ceil(document.getElementById('canvas').width / 128);
    canvas.width = 32 * length;
    context.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < length; ++i) {
      context.drawImage(platforms.middle.image, i * 32, 0);
    }
    platforms.plains = getEntity();

    return platforms;
  }

  let canvas = document.getElementById('canvas');
  let context = canvas.getContext('2d');
  window.camera = new Camera(canvas);

  let terrain = generate();

  let settings = [
    (canvas.width / 3) - 16, (canvas.height / 2) - 16, 32, 32,
    4, 0, 24, 32,
    [
      [0, 64, 32, 32],
      [32, 64, 32, 32],
      [64, 64, 32, 32],
    ], 10
  ];

  woman = new Sprite(woman, ...settings);
  woman.polygon.speed.x = 0.25;
  woman.indexes = [0, 1, 2, 1];
  man = new Sprite(man, ...settings);

  let spawner = new Spawner(
    [new StaticEntity(platform, 0, 0, platform.width, platform.height, 0, 32)]
  );
  spawner.start();

  let started = false;
  let character = woman;
  let timer = new Timer();
  let platforms = [terrain.plains.clone(0, canvas.height - 150)];
  extendTerrain();

  window.camera.speed.x = character.polygon.speed.x;

  window.addEventListener('keydown', function(event) {
    if (event.keyCode === 32) {
      if (!started) {
        let x = platforms[platforms.length - 1].polygon.points[1].x;
        platforms.push(terrain.right.clone(x, canvas.height - 150));

        spawner.spawned = platforms;
        spawner.start();
      }

      started = true;
      character.jump();
    }
  });

  function extendTerrain() {
    let last = platforms[platforms.length - 1];
    if (last.polygon.points[1].x < window.camera.right()) {
      let x = last.polygon.points[1].x;
      let plains = terrain.plains.clone(x, canvas.height - 150);
      platforms.push(plains);

      (plains.polygon.points[1].x < window.camera.right()) && extendTerrain();
    }
  }

  function reset() {
    let [x, y] = [(canvas.width / 3) + window.camera.x,
                  (canvas.height / 2) + window.camera.y];
    character.polygon.moveTo(x, y);

    spawner.stop();
    platforms = [terrain.plains.clone(camera.x, canvas.height - 150)];
    extendTerrain();

    started = false;
  }

  function loop() {
    started || extendTerrain();
    if (character.polygon.points[0].y > (canvas.height + 150)) {
      reset();
    }

    window.elapsed = timer.elapsed();
    var moveCamera = true;

    context.clearRect(0, 0, canvas.width, canvas.height);

    character.polygon.physics();
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
