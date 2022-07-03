class BezierCurve {
  constructor(pointA, PointB) {
    this.pointA = {
      x: pointA.x,
      y: pointA.y,
    };
    this.PointB = {
      x: PointB.x,
      y: PointB.y,
    };

    this.controlA = {
      x: pointA.anchor.x,
      y: pointA.anchor.y,
    };
    this.controlB = {
      x: PointB.anchor.x,
      y: PointB.anchor.y,
    };
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.lineWidth =  3;

    ctx.moveTo(this.pointA.x, this.pointA.y);
    ctx.bezierCurveTo(this.controlA.x, this.controlA.y, this.controlB.x, this.controlB.y, this.PointB.x, this.PointB.y);

    ctx.stroke();
  }
}