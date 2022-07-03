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
      } else {
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

function drawPoints() {
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

function drawPoint(x, y, color, stroke) {
  ctx.beginPath();
  ctx.arc(x, y, 10, 0, 2 * Math.PI);

  ctx.fillStyle = color;
  ctx.fill();

  ctx.strokeStyle = stroke;
  ctx.lineWidth = 2;
  ctx.stroke();
}