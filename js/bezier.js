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

    let coordsX = [this.pointA.x, this.controlA.x, this.controlB.x, this.pointB.x],
        coordsY = [this.pointA.y, this.controlA.y, this.controlB.y, this.pointB.y];
        
    ctx.moveTo(this.pointA.x, this.pointA.y);
    this.bezierCurveTo(coordsX, coordsY, 10000, ctx);

    ctx.stroke();
  }

  casteljauAlgorithm(coords, i, j, t){
    if(j == 0) return coords[i]
    return (1 - t) * this.casteljauAlgorithm(coords, i, j - 1, t) + t * this.casteljauAlgorithm(coords, i + 1, j - 1, t)
  }

  bezierCurveTo(coordsX, coordsY, num_steps, ctx){
    let n = coordsX.length,
        i;
    for(i = 0;i < num_steps;i++){
      let t = i / (num_steps - 1),
          x = this.casteljauAlgorithm(coordsX, 0, n - 1, t),
          y = this.casteljauAlgorithm(coordsY, 0, n - 1, t);
      
      ctx.lineTo(x, y);
    }
  }
}