import Polygon from 'polygons/polygon';

export default class Rectangle extends Polygon {
  constructor(x, y, width, height, style) {
    // 1--2
    // |  |
    // 4--3
    super([
      {x, y},
      {x: x + width, y},
      {x: x + width, y: y + height},
      {x, y: y + height},
    ], style);
  }
}
