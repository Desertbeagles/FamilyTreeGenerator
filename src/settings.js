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

electron.ipcRenderer.on('updateSettings', (event, message) => {
    outputGen.innerHTML = message.setNumGenerations;
    outputFrame.innerHTML = message.frameRate;
    sliderGen.value = message.setNumGenerations;
    sliderFrame.value = message.frameRate;
    currentRollDie.innerHTML = rollArray[message.rollNum];
    rollValue = message.rollNum;
});


var updateBtn = document.getElementById('updateSettings');


updateBtn.addEventListener('click', function() {
    console.log("\n Settings Updated \n");
    ipc.send('request-Number-Generations', document.getElementById('reqNumGen').value);
    ipc.send('request-Birth-Rate', rollValue);
    ipc.send('request-Frame-Rate', document.getElementById('reqFrameRate').value);
    var window = remote.getCurrentWindow();
    window.close();
});

var rollValue;

var rollBtn0 = document.getElementById('rollBtn0');
var rollBtn1 = document.getElementById('rollBtn1');
var rollBtn2 = document.getElementById('rollBtn2');
var currentRollDie = document.getElementById('currRollDie');
var rollArray = ["LOW", "NORMAL", "HIGH"];

rollBtn0.addEventListener('click', function() {
    currentRollDie.innerHTML = rollArray[0];
    rollValue = 0;
});
rollBtn1.addEventListener('click', function() {
    currentRollDie.innerHTML = rollArray[1];
    rollValue = 1;
});
rollBtn2.addEventListener('click', function() {
    currentRollDie.innerHTML = rollArray[2];
    rollValue = 2;
});


var sliderGen = document.getElementById("reqNumGen");
var outputGen = document.getElementById("currNumGen");

outputGen.innerHTML = sliderGen.value;

sliderGen.oninput = function() {
  outputGen.innerHTML = this.value;
}

var sliderFrame = document.getElementById("reqFrameRate");
var outputFrame = document.getElementById("currFramRate");

outputFrame.innerHTML = sliderFrame.value;

sliderFrame.oninput = function() {
  outputFrame.innerHTML = this.value;
}
