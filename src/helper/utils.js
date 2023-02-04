const toRad = (d) => {
  return (d * Math.PI) / 180;
};

const resizeCanvas = (canvas) => {
  let width = canvas.clientWidth;
  let height = canvas.clientHeight;

  canvas.width = width;
  canvas.height = height;
};

const initShaders = (gl) => {
  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vert);
  gl.compileShader(vertexShader);

  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, frag);
  gl.compileShader(fragmentShader);

  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  return program;
};
