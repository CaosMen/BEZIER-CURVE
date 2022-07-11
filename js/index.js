/* Canvas object */

const canvas = document.getElementById('canvas-screen');
const ctx = canvas.getContext('2d');

/* Canvas settings */

let clickType = 'move';

const squareConstant = 10;
const squareGridSize = 50;
const squareGridColor = '#888';
const squareGridThickness = 1;

/* Canvas variables */

let pauseActions = false;
let animateObject = null;
let currentAnimation = null;

const points = new Points();

window.onload = window.onresize = () => {
  canvas.addEventListener('mouseup', mouseUp);
  canvas.addEventListener('mouseleave', mouseLeave);
  canvas.addEventListener('mousedown', mouseDown);
  canvas.addEventListener('mousemove', mouseMove);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;  
  
  draw();
}

const draw = () => {
  /* Clear canvas */

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  /* Draw infinity square grid */

  drawGrid();
  drawLines();
  drawAnimationFrame();
  drawPoints();
}

function drawGrid() {
  const margin = squareConstant * squareGridSize;

  let left = -margin;
  let top = -margin;
  let right = ((canvas.width / squareGridSize) * squareGridSize) + margin + squareGridThickness;
  let bottom = ((canvas.height / squareGridSize) * squareGridSize) + margin + squareGridThickness;

  ctx.clearRect(left, top, right - left, bottom - top);

  ctx.beginPath();
  ctx.lineWidth = squareGridThickness;

  for (let x = left; x < right; x += squareGridSize) {
    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);
  }

  for (let y = top; y < bottom; y += squareGridSize) {
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
  }

  ctx.strokeStyle = squareGridColor;
  ctx.stroke();
}

function drawLines() {
  points.getPoints().forEach((point, index) => {
    const nextPoint = points.getPoint(index + 1);

    ['position', 'anchor'].forEach((type) => {
      if (type === 'position') {
        if (nextPoint) {
          const bezierCurve = new BezierCurve(point, nextPoint);

          bezierCurve.draw(ctx);
        }
      } else if (currentAnimation == null) {
        ctx.beginPath();
        ctx.lineWidth =  3;
        ctx.setLineDash([5, 5]);

        if (index !== points.getCount() - 1) {
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(point.anchor[1].x, point.anchor[1].y);

          if (nextPoint) {
            ctx.moveTo(point.anchor[1].x, point.anchor[1].y);
            ctx.lineTo(nextPoint.anchor[0].x, nextPoint.anchor[0].y);

            ctx.moveTo(nextPoint.anchor[0].x, nextPoint.anchor[0].y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
          }
        }

        ctx.strokeStyle = point.anchor.stroke;
        ctx.stroke();

        ctx.setLineDash([]);
      }
    });
  });
}

function drawAnimationFrame() {
  if (currentAnimation != null) {
    if (currentAnimation === 'curvature') {
      const curvature = animateObject.curvature;
      const radius = 1 / curvature;

      ctx.beginPath();

      const normal = normalizeVector(animateObject.normal);

      normal.x += animateObject.point.x;
      normal.y += animateObject.point.y;
        
      const distance = Math.sqrt(Math.pow(normal.x - animateObject.point.x, 2) + Math.pow(normal.y - animateObject.point.y, 2));

      const x = animateObject.point.x + (radius * (normal.x - animateObject.point.x) / distance);
      const y = animateObject.point.y + (radius * (normal.y - animateObject.point.y) / distance);

      ctx.arc(x, y, Math.abs(radius), 0, 2 * Math.PI);

      ctx.strokeStyle = '#888';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.beginPath();

      ctx.moveTo(animateObject.point.x, animateObject.point.y);
      ctx.lineTo(x, y);

      ctx.strokeStyle = '#888';
      ctx.lineWidth = 3;
      ctx.stroke();
    } else if (currentAnimation === 'derivative') {
      const primaryLineLength = 100;
      const secondaryLineLength = 50;

      ctx.beginPath();

      const origin = animateObject.point;
      
      const normal = normalizeVector(animateObject.normal);

      normal.x = origin.x + (normal.x * secondaryLineLength);
      normal.y = origin.y + (normal.y * secondaryLineLength);

      drawArrow(origin.x, origin.y, normal.x, normal.y, '#888');

      const firstDerivative = normalizeVector(animateObject.firstDerivative);

      firstDerivative.x = origin.x + (firstDerivative.x * primaryLineLength);
      firstDerivative.y = origin.y + (firstDerivative.y * primaryLineLength);

      drawArrow(origin.x, origin.y, firstDerivative.x, firstDerivative.y, '#FF0000');

      const secondDerivative = normalizeVector(animateObject.secondDerivative);

      secondDerivative.x = origin.x + (secondDerivative.x * secondaryLineLength);
      secondDerivative.y = origin.y + (secondDerivative.y * secondaryLineLength);

      drawArrow(origin.x, origin.y, secondDerivative.x, secondDerivative.y, '#00FF00');

      const thirdDerivative = normalizeVector(animateObject.thirdDerivative);

      thirdDerivative.x = origin.x + (thirdDerivative.x * secondaryLineLength);
      thirdDerivative.y = origin.y + (thirdDerivative.y * secondaryLineLength);

      drawArrow(origin.x, origin.y, thirdDerivative.x, thirdDerivative.y, '#0000FF');
    }
  }
}

function drawPoints() {
  if (currentAnimation == null) {
    points.getPoints().forEach((point) => {
      ['position', 'anchor'].forEach((type) => {
        if (type === 'position') {
          drawPoint(point.x, point.y, point.color, point.stroke);
        } else {
          if (points.getCount() > 1) {
            point.anchor.forEach((anchor) => {
              if (anchor.visible) {
                drawPoint(anchor.x, anchor.y, anchor.color, anchor.stroke);
              }
            });
          }
        }
      });
    });
  }
}

/* Utils draw functions */

function drawPoint(x, y, color, stroke) {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);

  ctx.fillStyle = color;
  ctx.fill();

  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawArrow(xFrom, yFrom, xTo, yTo, color) {
  const arrowSize = 10;
  const arrowAngle = Math.PI / 6;

  const angle = Math.atan2(yTo - yFrom, xTo - xFrom);

  ctx.beginPath();
  ctx.moveTo(xFrom, yFrom);
  ctx.lineTo(xTo, yTo);
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(xTo, yTo);
  ctx.lineTo(xTo - arrowSize * Math.cos(angle - arrowAngle), yTo - arrowSize * Math.sin(angle - arrowAngle));
  ctx.lineTo(xTo - arrowSize * Math.cos(angle + arrowAngle), yTo - arrowSize * Math.sin(angle + arrowAngle));
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

/* Animations */

async function curvature() {
  if (points.getCount() > 1 && currentAnimation == null) {
    pauseActions = true;
    currentAnimation = 'curvature'; 

    const steps = 100;

    let currentPoint = points.getPoint(0);

    for (let i = 1; i < points.getCount(); i++) {
      const nextPoint = points.getPoint(i);

      const bezierCurve = new BezierCurve(currentPoint, nextPoint);

      for (let t = 1; t < steps; t++) {
        const tValue = t / (steps - 1);

        const point = bezierCurve.getPointInTime(tValue);

        const curvature = bezierCurve.getCurvatureInTime(tValue);
        const normal = bezierCurve.getNormalInTime(tValue);
        
        animateObject = {
          point,
          normal,
          curvature
        };

        draw();

        await sleep(50);
      }

      currentPoint = nextPoint;
    }

    pauseActions = false;
    currentAnimation = null;
    animateObject = null;

    draw();
  }
}

async function derivative() {
  if (points.getCount() > 1 && currentAnimation == null) {
    pauseActions = true;
    currentAnimation = 'derivative'; 

    const steps = 100;

    let currentPoint = points.getPoint(0);

    for (let i = 1; i < points.getCount(); i++) {
      const nextPoint = points.getPoint(i);

      const bezierCurve = new BezierCurve(currentPoint, nextPoint);

      for (let t = 1; t < steps; t++) {
        const tValue = t / (steps - 1);

        const point = bezierCurve.getPointInTime(tValue);
        const normal = bezierCurve.getNormalInTime(tValue);
        
        const firstDerivative = bezierCurve.getFirstDerivativeInTime(tValue);
        const secondDerivative = bezierCurve.getSecondDerivativeInTime(tValue);
        const thirdDerivative = bezierCurve.getThirdDerivativeInTime(tValue);
        
        animateObject = {
          point,
          normal,
          firstDerivative,
          secondDerivative,
          thirdDerivative
        };

        draw();

        await sleep(50);
      }

      currentPoint = nextPoint;
    }

    pauseActions = false;
    currentAnimation = null;
    animateObject = null;

    draw();
  }
}