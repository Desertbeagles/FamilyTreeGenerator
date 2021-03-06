const electron = require('electron');
const path = require('path');
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;
// const fileio = require('./fileio.js');
const Person = require('./modules/person.js');
const Tree = require('./modules/tree.js');
const House = require('./modules/house.js');
const Calc = require('./modules/displayCalculation.js');
const Mouse = require('./modules/mouseEvents.js');
const Display = require('./modules/display.js');
const Preferences = require('./modules/preferences.js');
const screen = electron.remote.screen;

const settingsBtn = document.getElementById('settingsBtn')
const generateBtn = document.getElementById('generateBtn')

var canvas;
var ctx;
var widthCanvas;
var heightCanvas;

// View parameters
var xleftView = 0;
var ytopView = 0;
var widthViewOriginal; //actual width and height of zoomed and panned display
var heightViewOriginal;
var widthView; //actual width and height of zoomed and panned display
var heightView;
var tree;
var preferences;


var prevCanvwidth = 0;
var prevCanvheight = 0;


var img = new Image();



function setup() {
    console.log("\n [Start] index.js setup function \n");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");


    preferences = new Preferences();

    widthCanvas = canvas.width* preferences.zoomMod;
    heightCanvas = canvas.height* preferences.zoomMod;
    widthViewOriginal = canvas.width* preferences.zoomMod;
    heightViewOriginal = canvas.height* preferences.zoomMod;
    widthView = widthViewOriginal; //actual width and height of zoomed and panned display
    heightView = heightViewOriginal;

    canvas.addEventListener("mousedown", Mouse.handleMouseDown, false); // click and hold to pan
    canvas.addEventListener("mousemove", Mouse.handleMouseMove, false);
    canvas.addEventListener("mouseup", Mouse.handleMouseUp, false);
    canvas.addEventListener("mousewheel", Mouse.handleMouseWheel, false); // mousewheel duplicates dblclick functio
    // canvas.addEventListener("click", displayEvent, false);

    ctx.font = "14px Arial";
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    canvas.width = window.innerWidth * preferences.zoomMod;
    canvas.height = window.innerHeight * preferences.zoomMod;

    img.src = path.join(__dirname, '../assets/images/heirCrown.png');
}


//------------------------------------------------------------------------------

window.addEventListener("load", function(event) {
    setup();
});

settingsBtn.addEventListener('click', function(event) {
    console.log("Settings Button Clicked")
    const modalPath = path.join('file://', __dirname, 'settings.html')
    let win = new BrowserWindow({
        frame: true,
        transparent: false,
        alwaysOnTop: true,
        width: 500,
        height: 600,
        webPreferences: {
          nodeIntegration: true
          }
    })
    win.on('close', function() {
        win = null
    })
    win.loadURL(modalPath)
    win.webContents.on('did-finish-load', () => {
        win.webContents.send('updateSettings', preferences)
    })
    win.show()
});

generateBtn.addEventListener('click', function(event) {
    console.log("Generate Button Clicked")
    //generateFamilyTree();
    frame = preferences.frameRate;
    tree = new Tree("German", preferences.setNumGenerations);
    tree.setup();
    tree.draw();
});

window.addEventListener("resize", function(event) {
    //set canvas size to size of window
    canvas.width = window.innerWidth*preferences.zoomMod;
    canvas.height = window.innerHeight*preferences.zoomMod;
    console.log("\n [CTX] Scale set to " + widthCanvas + "/" + widthView + " by " + heightCanvas + "/" + heightView + " \n");
    frame = preferences.frameRate;
    if(tree != null){
        tree.draw();
    }
});

//------------------------------------------------------------------------------



//------------------------------------------------------------------------------


ipc.on('numberOfGenerations', function(event, arg) {
    if (arg != 0) {
        preferences.setNumGenerations = Number(arg);
        console.log("\n setNumGenerations = " + arg + " \n");
    }
});

ipc.on('birthRate', function(event, arg) {
    if (arg < 5) {
        preferences.rollNum = Number(arg);
        console.log("\n rollNum = " + arg + " \n");
    }
});

ipc.on('frameRate', function(event, arg) {
    if (arg != 0) {
        preferences.frameRate = Number(arg);
        console.log("\n FrameRate = " + arg + " \n");
    }
});
//------------------------------------------------------------------------------

function loadNameFile(culture, type, filename) {
    var fs = require("fs");
    console.log("\n [START] loadNameFile \n");
    var filePath = path.join(__dirname, '..', 'assets', 'files', 'names', culture, type, filename);
    var content = fs.readFileSync(filePath, 'utf8');
    console.log("\n [File Loaded] loadNameFile " + filename+ " \n");
    console.log("\n [EXIT] loadNameFile \n");
    return JSON.parse(content);
}

function coatOfArmsGen(culture) {
    var newImg = new Image();
    var randInt = Math.floor(Math.random() * 5) + 1;
    newImg.src = path.join(__dirname, '../assets/images/coatofarms/german/' + randInt + '.png');
    return newImg;
}
