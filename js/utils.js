function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function normalizeVector(vector) {
  const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

  return {
    x: vector.x / length,
    y: vector.y / length
  };
}