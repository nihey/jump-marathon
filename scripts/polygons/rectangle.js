import Polygon from 'polygons/polygon';

export default class Rectangle extends Polygon {
  constructor(x, y, width, height, style) {
    super([
      {x, y},
      {x: x + width, y},
      {x: x + width, y: y + height},
      {x, y: y + height},
    ], style);
  }
}
