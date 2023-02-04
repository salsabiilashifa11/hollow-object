// Contain all function for manipulating vectors

// Substract vector a with vector b
function subtractVectors(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

// Return the normalize value of the vector v
function normalize(v) {
  var length = Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    return [v[0] / length, v[1] / length, v[2] / length];
  } else {
    return [0, 0, 0];
  }
}

// Cross product between vector a and vector b
function cross(a, b) {
  return [a[1] * b[2] - a[2] * b[1],
          a[2] * b[0] - a[0] * b[2],
          a[0] * b[1] - a[1] * b[0]];
}

// Get the all vector normals of the edge beam object
function getVectorNormals(vPosition) {
  const n = vPosition.length;
  var vNormals = [];
  for (let i = 0; i < n; i += 9){
    const p1 = [vPosition[i], vPosition[i+1], vPosition[i+2]];
    const p2 = [vPosition[i+3], vPosition[i+4], vPosition[i+5]];
    const p3 = [vPosition[i+6], vPosition[i+7], vPosition[i+8]];
    const vec1 = subtractVectors(p2, p1);
    const vec2 = subtractVectors(p3, p1);
    const normalDirection = cross(vec1, vec2);
    const vecNormal  = normalize(normalDirection);
    for (let j = 0; j < 3; j++){
      vNormals = vNormals.concat(vecNormal);
    }
  }
  return vNormals;
}
