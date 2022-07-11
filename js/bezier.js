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

  getPointInTime(t) {
    const coordsX = [this.pointA.x, this.controlA.x, this.controlB.x, this.pointB.x];
    const coordsY = [this.pointA.y, this.controlA.y, this.controlB.y, this.pointB.y];

    const x = this.casteljauAlgorithm(coordsX, 0, coordsX.length - 1, t);
    const y = this.casteljauAlgorithm(coordsY, 0, coordsY.length - 1, t);

    return {
      x,
      y,
    };
  }

  getFirstDerivativeInTime(t) {
    const p0 = this.pointA;
    const p1 = this.controlA;
    const p2 = this.controlB;
    const p3 = this.pointB;

    const dx = p0.x * (-3 * Math.pow(t, 2) + 6 * t - 3) +
      p1.x * (9 * Math.pow(t, 2) - 12 * t + 3) +
      p2.x * (-9 * Math.pow(t, 2) + 6 * t) +
      p3.x * (3 * Math.pow(t, 2));

    const dy = p0.y * (-3 * Math.pow(t, 2) + 6 * t - 3) +
      p1.y * (9 * Math.pow(t, 2) - 12 * t + 3) +
      p2.y * (-9 * Math.pow(t, 2) + 6 * t) +
      p3.y * (3 * Math.pow(t, 2));

    return {
      x: dx,
      y: dy,
    };
  }

  getSecondDerivativeInTime(t) {
    const p0 = this.pointA;
    const p1 = this.controlA;
    const p2 = this.controlB;
    const p3 = this.pointB;

    const ddx = p0.x * (-6 * t + 6) +
      p1.x * (18 * t - 12) +
      p2.x * (-18 * t + 6) +
      p3.x * (6 * t);

    const ddy = p0.y * (-6 * t + 6) +
      p1.y * (18 * t - 12) +
      p2.y * (-18 * t + 6) +
      p3.y * (6 * t);

    return {
      x: ddx,
      y: ddy,
    };
  }

  getThirdDerivativeInTime(t) {
    const p0 = this.pointA;
    const p1 = this.controlA;
    const p2 = this.controlB;
    const p3 = this.pointB;
    
    const dddx = p0.x * (-6) +
      p1.x * (18) +
      p2.x * (-18) +
      p3.x * (6);

    const dddy = p0.y * (-6) +
      p1.y * (18) +
      p2.y * (-18) +
      p3.y * (6);

    return {
      x: dddx,
      y: dddy,
    };
  }

  getNormalInTime(t) {
    let derivative = this.getFirstDerivativeInTime(t);
    
    let normal = {
      x: derivative.y,
      y: -derivative.x,
    };

    return normal;
  }
  
  getCurvatureInTime(t) {
    const firstDerivative = this.getFirstDerivativeInTime(t);
    const secondDerivative = this.getSecondDerivativeInTime(t);

    const det = firstDerivative.x * secondDerivative.y - firstDerivative.y * secondDerivative.x;
    const firstDerivativeAbs = Math.pow(Math.sqrt(Math.pow(firstDerivative.x, 2) + Math.pow(firstDerivative.y, 2)), 3);

    const curvature = det / firstDerivativeAbs;

    return curvature;
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