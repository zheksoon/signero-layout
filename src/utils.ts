export function closestEdge(x, y, width, height) {
  const q1 = y * width > x * height;
  const q2 = (height - y) * width > x * height;

  if (q1) {
    if (q2) {
      return "left";
    } else {
      return "bottom";
    }
  } else {
    if (q2) {
      return "top";
    } else {
      return "right";
    }
  }
}

export function getRandomColor() {
  return `hsl(${Math.random() * 360}, 80%, 50%)`;
}
