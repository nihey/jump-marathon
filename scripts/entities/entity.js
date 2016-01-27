import Rectangle from 'polygons/rectangle';

export default class Entity {
  constructor(image, x=0, y=0, width=image.width, height=image.height, dx=x, dy=y, dw=width, dh=height) {
    this.box = {x, y, width, height, dx, dy, dw, dh};
    this.polygon = new Rectangle(x + dx, y + dy, dw, dh);
    this.polygon.onPhysics = this.onPhysics && this.onPhysics.bind(this);
    this.image = image;
    this.camera = window.camera || {x: 0, y: 0};
  }

  move(x, y) {
    return this.polygon.move(x, y);
  }

  clone(x=this.box.x, y=this.box.y) {
    return new Entity(this.image, x, y, this.box.width, this.box.height,
                      this.box.dx, this.box.dy, this.box.dw, this.box.dh);
  }

  collides(entity) {
    return this.polygon.collides(entity.polygon);
  }

  draw(context) {
    context.drawImage(this.image, this.box.x - this.camera.x,
                                  this.box.y - this.camera.y);
  }

  render(context) {
    this.polygon.physics();
    this.draw(context);
  }
}
