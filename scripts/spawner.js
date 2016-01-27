let defaultRange = {
  x: {min: 0, max: 120, delta: Infinity},
  y: {min: 100, max: 400, delta: 100},
}

export default class Spawner {
  constructor(pool=[], spawned=[], range=defaultRange, interval=500) {
    this.pool = pool;
    this.spawned = spawned.sort(e => e.points[0].x + e.box.width);
    this.range = range;
    this.interval = interval;
  }

  getRange(axis) {
    let range = this.range[axis];
    let [min, amplitude] = [range.min, range.max - range.min];
    let last = this.spawned[this.spawned.length - 1];
    if (last) {
      min = Math.max(range.min, last.polygon.points[0][axis] - range.delta);
      amplitude = Math.min(range.max, last.polygon.points[0][axis] + range.delta) - min;
    }

    return min + (amplitude * Math.random());
  }

  spawnable() {
    if (this.spawned.length === 0) {
      return true;
    }

    let entity = this.spawned[this.spawned.length - 1];
    let max = entity.polygon.points[1].x;
    return max < (window.camera.x + window.camera.canvas.width);
  }

  trySpawn() {
    if (!this.spawnable()) {
      return;
    }

    // Clear boxes that were left behind
    while (true) {
      let entity = this.spawned[0];
      if (!entity) {
        break;
      }
      if (entity.polygon.points[1].x < window.camera.x) {
        this.spawned.splice(0, 1);
      } else {
        break;
      }
    }

    let selected = this.pool[Math.floor(Math.random() * this.pool.length)];
    let range = [
      window.camera.x + window.camera.width + this.getRange('x'),
      this.getRange('y'),
    ];

    this.spawned.push(selected.clone(...range));
  }

  start() {
    this.id = setInterval(this.trySpawn.bind(this), this.interval);
  }

  stop() {
    if (this.id !== undefined) {
      clearInterval(this.id);
      this.id = undefined;
    }
  }
}
