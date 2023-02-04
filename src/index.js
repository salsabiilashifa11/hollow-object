"use strict";

const vert = `
attribute vec4 a_position;
attribute vec4 a_color;
attribute vec3 a_normal;

uniform mat4 u_matrix;

uniform mat4 u_normal_matrix;
uniform mat4 u_model_view_matrix;

varying vec4 v_color;
varying highp vec3 v_lighting;

void main() {
  gl_Position = u_matrix * a_position;
  v_color = a_color;

  // Apply lighting effect
  highp vec3 ambient_light = vec3(0.85, 0.85, 0.85);
  highp vec3 directional_light_color = vec3(1, 1, 1);
  highp vec3 directional_vector = normalize(vec3(0.85, 0.8, 0.75));

  highp vec4 transformed_normal = u_normal_matrix * vec4(a_normal, 1.0);

  highp float directional = max(dot(transformed_normal.xyz, directional_vector), 0.0);

  v_lighting = ambient_light + (directional_light_color * directional);

}
`;


const frag = `
precision mediump float;

// Passed in from the vertex shader.
varying lowp vec4 v_color;
varying highp vec3 v_lighting;

uniform bool u_shading;

void main() {
  if (u_shading) {
    gl_FragColor = vec4(v_color.rgb * v_lighting, v_color.a);
  } else {
    gl_FragColor = v_color;
  }
}
`;

var moveCamera = true;
const canvas =  document.getElementById('canvas');
console.log(window.width);

function main(data) {
  let { colorPoints, vertPoints, xmid, ymid, zmid} = data;

  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  var program = initShaders(gl);

  var positionLocation = gl.getAttribLocation(program, "a_position");
  var colorLocation = gl.getAttribLocation(program, "a_color");
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  var shadingLocation = gl.getUniformLocation(program, "u_shading");
  var normalMatrixLocation = gl.getUniformLocation(program, "u_normal_matrix");
  var aVertexNormal = gl.getAttribLocation(program, "a_normal")
  var modelViewMatrix = gl.getUniformLocation(program, "u_model_view_matrix");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertPoints), gl.STATIC_DRAW);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colorPoints), gl.STATIC_DRAW);

  var normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  const vertexNormals = getVectorNormals(vertPoints);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
  
  requestAnimationFrame(drawScene);

  function drawScene() {
    resizeCanvas(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(program);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.UNSIGNED_BYTE, true, 0, 0);

    gl.enableVertexAttribArray(aVertexNormal);
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.vertexAttribPointer(aVertexNormal, 3, gl.FLOAT, false, 0, 0);


    let fov = document.getElementById("fov").value;

    let translation = [
      document.getElementById("translate-x").value * 1 +
        (document.getElementById("move-camera-horizontal").value - 200) * -1,
      document.getElementById("translate-y").value * 1 +
        (document.getElementById("move-camera-vertical").value - 200) * -1,
      document.getElementById("translate-z").value,
    ];

    let scale = [
      document.getElementById("scale-x").value,
      document.getElementById("scale-y").value,
      document.getElementById("scale-z").value,
    ];

    let rotate = [
      document.getElementById("rotate-x").value * 1 +
        (document.getElementById("rotate-camera-vertical").value - 50) * -1,
      document.getElementById("rotate-y").value * 1 +
        (document.getElementById("rotate-camera-horizontal").value - 50) * -1,
      document.getElementById("rotate-z").value * 1,
    ];

    let rotateCamera = [
      (document.getElementById("rotate-camera-vertical").value - 50) * -1,
      (document.getElementById("rotate-camera-horizontal").value - 50) * -1
    ];

    let isShading = document.getElementById("shading-toggle").checked;

    let aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    let width = gl.canvas.clientWidth;
    let height = gl.canvas.clientHeight;


    let angleX = ((rotate[0] - 50.0) * Math.PI) / 25.0;
    let angleY = ((rotate[1] - 50.0) * Math.PI) / 25.0;
    let angleZ = ((rotate[2] - 50.0) * Math.PI) / 25.0;

    let cameraAngleX = ((rotateCamera[0] - 50.0) * Math.PI) / 25.0;
    let cameraAngleY = ((rotateCamera[1] - 50.0) * Math.PI) / 25.0;


    let projection = document.getElementById("projection").value
    let matrix = perspective(toRad(fov), aspect, 1, 2000);
    if (projection == "orthographic"){
      matrix = orthographic(-width/3, width/3, -height/3, height/3, 1, 2000);
    }
    else if (projection == "oblique") {
      matrix = oblique(-width/3, width/3, -height/3, height/3, 1, 2000, 45);
    }

    matrix = translate(matrix, translation[0], translation[1], translation[2]);
    matrix = scaler(matrix, scale[0], scale[1], scale[2]);
    matrix = rotateX(matrix, angleX, xmid, ymid, zmid);
    matrix = rotateY(matrix, angleY, xmid, ymid, zmid);
    matrix = rotateZ(matrix, angleZ, xmid, ymid, zmid);

    matrix = rotateCameraX(matrix, cameraAngleX);
    matrix = rotateCameraY(matrix, cameraAngleY);

    gl.uniformMatrix4fv(modelViewMatrix, false, matrix);

    let normalMatrix = transpose(inverse(matrix));
    gl.uniformMatrix4fv(normalMatrixLocation, false, normalMatrix);

  
    gl.uniformMatrix4fv(matrixLocation, false, matrix);
    gl.uniform1i(shadingLocation, isShading);
    gl.drawArrays(gl.TRIANGLES, 0, vertPoints.length / 3);

    requestAnimationFrame(drawScene);
  }
}

