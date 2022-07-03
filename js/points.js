class Points {
  constructor() {
    this.points = [];
    this.count = 0;
  }

  /* Baseic methods */

  add(point) {
    this.points.push(point);
    this.count++;

    this.updateVisibility();
  }

  remove(point) {
    this.points.splice(this.points.indexOf(point), 1);
    this.count--;

    this.updateVisibility();
  }

  clear() {
    this.points = [];
    this.count = 0;
  }

  /* Getters */

  getPoints() {
    return this.points;
  }

  getCount() {
    return this.count;
  }

  /* Especific Getters */

  getPoint(arrayPosition) {
    return this.points[arrayPosition];
  }

  getAnchor(arrayPosition, anchorPosition) {
    return this.points[arrayPosition].anchor[anchorPosition];
  }

  getPointAndAnchorIndexes(x, y) {
    let result = null;
    this.points.forEach((point, index) => {
      const anchorPosition = point.findAnchorIndex(x, y);

      if (anchorPosition !== -1) {
        result = [index, anchorPosition];
      }
    });

    return result;
  }
  
  /* Utils */
  
  updateVisibility() {
    this.points.forEach((point, index) => {
      if (this.count > 1) {
        if (index === 0) {
          point.anchor[0].visible = false;
          point.anchor[1].visible = true;
        } else if (index === this.count - 1) {
          point.anchor[0].visible = true;
          point.anchor[1].visible = false;
        } else {
          point.anchor.forEach((anchor) => {
            anchor.visible = true;
          });
        }
      } else {
        point.anchor.forEach((anchor) => {
          anchor.visible = false;
        });
      }
    });
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = '#a7c7e7';
    this.stroke = '#888';
    this.anchor = [
      {
        x: x,
        y: y,
        color: '#ff6961',
        stroke: '#888',
        visible: true,
      },
      {
        x: x,
        y: y,
        color: '#ff6961',
        stroke: '#888',
        visible: true,
      },
    ];
  }

  findAnchorIndex(x, y) {
    return this.anchor.findIndex((anchor) => {
      return anchor.x === x && anchor.y === y && anchor.visible;
    });
  }
}