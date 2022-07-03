class BezierCurve {
  constructor(pointA, pointB) {
    this.pointA = {
      x: pointA.x,
      y: pointA.y,
    };
    this.pointB = {
      x: pointB.x,
      y: pointB.y,
    };

    this.controlA = {
      x: pointA.anchor[1].x,
      y: pointA.anchor[1].y,
    };
    this.controlB = {
      x: pointB.anchor[0].x,
      y: pointB.anchor[0].y,
    };
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth =  3;

    ctx.moveTo(this.pointA.x, this.pointA.y);
    ctx.bezierCurveTo(this.controlA.x, this.controlA.y, this.controlB.x, this.controlB.y, this.pointB.x, this.pointB.y);

    ctx.stroke();
  }
}