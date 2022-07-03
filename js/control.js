/* Movement Handler */

function changeType(type) {
  clickType = type;

  document.getElementById('canvas-screen').setAttribute('currentType', type);
}

function moveHandler(moveX, moveY) {
  const transform = ctx.getTransform();
  const sideTransform = transform.e;
  const topTransform = transform.f;

  const limits = squareConstant * squareGridSize;

  if (sideTransform + moveX > limits) {
    moveX = moveX < 0 ? moveX : 0;
  }

  if (sideTransform + moveX < -limits) {
    moveX = moveX > 0 ? moveX : 0;
  }

  if (topTransform + moveY > limits) {
    moveY = moveY < 0 ? moveY : 0;
  }

  if (topTransform + moveY < -limits) {
    moveY = moveY > 0 ? moveY : 0;
  }
  
  return { moveX, moveY };
}

/* Mouse events */

let start = null;

const getPos = (e) => ({
  x: e.clientX - canvas.offsetLeft,
  y: e.clientY - canvas.offsetTop 
});

const getPosCanvas = (e) => {
  const pos = getPos(e);

  const transform = ctx.getTransform();
  const sideTransform = transform.e;
  const topTransform = transform.f;
  
  return {
    x: Math.round((pos.x - sideTransform) / squareGridSize) * squareGridSize,
    y: Math.round((pos.y - topTransform) / squareGridSize) * squareGridSize,
  };
}

const mouseUp = (e) => {
  switch (clickType) {
    case 'move':
      start = null;
      break;
    case 'pointer':
      break;
    case 'anchor':
      start = null;
      break;
    default:
      break;
  };
}

const mouseLeave = (e) => {
  switch (clickType) {
    case 'move':
      start = null;
      break;
    case 'pointer':
      break;
    case 'anchor':
      start = null;
      break;
    default:
      break;
  };
}

const mouseDown = (e) => {
  switch (clickType) {
    case 'move':
      start = getPos(e);
      break;
    case 'pointer':
      const point = getPosCanvas(e);

      points.push(new Point(point.x, point.y));
      draw();
      break;
    case 'anchor':
      const clickPos = getPosCanvas(e);

      start = points.findIndex((point) => {
        return point.anchor.x === clickPos.x && point.anchor.y === clickPos.y;
      });
      break;
    default:
      break;
  };
}

const mouseMove = (e) => {
  switch (clickType) {
    case 'move':
      if (start === null) {
        return;
      };
    
      const posMove = getPos(e);
    
      let moveX = posMove.x - start.x;
      let moveY = posMove.y - start.y;
    
      ({ moveX, moveY } = moveHandler(moveX, moveY));
    
      ctx.translate(moveX, moveY);
    
      draw();
      start = posMove;
      break;
    case 'pointer':
      
      break;
    case 'anchor':
      if (start === null) {
        return;
      };

      const posAnchor = getPosCanvas(e);

      const point = points[start];

      point.anchor.x = posAnchor.x;
      point.anchor.y = posAnchor.y;

      draw();
      break;
    default:
      break;
  };
}