const electron = require('electron');
const path = require('path');
const remote = electron.remote;
const ipc = electron.ipcRenderer;

// console.log(index);
// const closeBtn = document.getElementById('closeBtn');
//
// closeBtn.addEventListener('click', function(event) {
//     var window = remote.getCurrentWindow();
//     window.close();
// });

var updateBtn = document.getElementById('updateSettings');


updateBtn.addEventListener('click', function() {
    console.log("\n Settings Updated \n");
    ipc.send('request-Number-Generations', document.getElementById('reqNumGen').value);
    ipc.send('request-Birth-Rate', document.getElementById('reqBirthRate').value);
    ipc.send('request-Frame-Rate', document.getElementById('reqFrameRate').value);
    var window = remote.getCurrentWindow();
    window.close();
});

var sliderBR = document.getElementById("reqBirthRate");
var outputBR = document.getElementById("currBirthRate");

outputBR.innerHTML = sliderBR.value;

sliderBR.oninput = function() {
  outputBR.innerHTML = this.value;
}

var sliderGen = document.getElementById("reqNumGen");
var outputGen = document.getElementById("currBirthRate");

outputGen.innerHTML = sliderGen.value;

sliderGen.oninput = function() {
  outputGen.innerHTML = this.value;
}

var sliderFrame = document.getElementById("reqFrameRate");
var outputFrame = document.getElementById("currBirthRate");

outputFrame.innerHTML = sliderFrame.value;

sliderFrame.oninput = function() {
  outputFrame.innerHTML = this.value;
}
