const electron = require('electron')
const path = require('path')
const remote = electron.remote
const ipc = electron.ipcRenderer

var fs = require("fs");

function loadNameFile(culture, type, filename){
    console.log("\n [START] loadNameFile \n");
    var filePath = path.join(__dirname, '..', 'assets', 'files', culture, type, filename);
    var content = fs.readFile(filePath, "utf8");
    console.log("\n [File Loaded] loadNameFile \n")
    console.log("\n *EXIT* \n");
    return content;
}