let translateX = document.getElementById("translate-x");
let translateY = document.getElementById("translate-y");
let translateZ = document.getElementById("translate-z");

translateX.max = canvas.width;
translateY.max = canvas.height;

let scaleXControl = document.getElementById("scale-x");
let scaleYControl = document.getElementById("scale-y");
let scaleZControl = document.getElementById("scale-z");

let rotateXControl = document.getElementById("rotate-x");
let rotateYControl = document.getElementById("rotate-y");
let rotateZControl = document.getElementById("rotate-z");

let fov = document.getElementById("fov");

let moveCameraHorizontalControl = document.getElementById(
  "move-camera-horizontal"
);
let moveCameraVerticalControl = document.getElementById("move-camera-vertical");

let rotateCameraHorizontalControl = document.getElementById(
  "rotate-camera-horizontal"
);
let rotateCameraVerticalControl = document.getElementById(
  "rotate-camera-vertical"
);

let projectionSelector = document.getElementById("projection");

let shadingToggle = document.getElementById("shading-toggle");

let filePicker = document.getElementById("file-picker");
let fileExportName = document.getElementById("file-name-field");
let saveFileButton = document.getElementById("save-file-button");
let helpBtn = document.getElementById("help-btn");
let help = document.getElementById("help");
let close = document.getElementById("close");

let reset = document.getElementById("reset");

translateX.oninput = function () {
  main(data);
};

translateY.oninput = function () {
  main(data);
};

translateZ.oninput = function () {
  main(data);
};

scaleXControl.oninput = function () {
  main(data);
};

scaleYControl.oninput = function () {
  main(data);
};

scaleZControl.oninput = function () {
  main(data);
};

rotateX.oninput = function () {
  main(data);
};

rotateY.oninput = function () {
  main(data);
};

rotateZ.oninput = function () {
  main(data);
};

moveCameraHorizontalControl.oninput = function () {
  main(data);
};

moveCameraVerticalControl.oninput = function () {
  main(data);
};

rotateCameraHorizontalControl.oninput = function () {
  main(data);
};

rotateCameraVerticalControl.oninput = function () {
  main(data);
};

projectionSelector.onchange = function () {
  main(data);
};

shadingToggle.onclick = function () {
  main(data);
};

fov.oninput = function () {
  main(data);
};

filePicker.onchange = function () {
  var file = filePicker.files[0];

  var reader = new FileReader();
  reader.onload = function (e) {
    var content = e.target.result;
    var parsedData = JSON.parse(content);
    data = parsedData;
    
    translateX.value = -data["xmid"];
    translateY.value = -data["ymid"];

    rotateXControl.value = data["rotx"];
    rotateYControl.value = data["roty"];
    rotateZControl.value = data["rotz"];

    fov.value = data["fov"];

    main(data);
  };

  reader.readAsText(file);
};

helpBtn.onclick = function () {
  help.style.display = "block";
};

close.onclick = function () {
  help.style.display = "none";
};

reset.onclick = function () {
  translateX.value = -data["xmid"];
  translateY.value = -data["ymid"];
  translateZ.value = -400;

  scaleXControl.value = 1;
  scaleYControl.value = 1;
  scaleZControl.value = 1;

  rotateXControl.value = data["rotx"];
  rotateYControl.value = data["roty"];
  rotateZControl.value = data["rotz"];

  moveCameraHorizontalControl.value = 200;
  moveCameraVerticalControl.value = 200;

  rotateCameraHorizontalControl.value = 50;
  rotateCameraVerticalControl.value = 50;

  projectionSelector.value = "perspective";

  shadingToggle.checked = false;

  fov.value = data["fov"];

  main(data);
};
