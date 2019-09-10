class Preferences{
    constructor(){
        this.frameRate = 5;
        this.frameRateToggle = false;
        this.zoomMod = 1.5;
        this.setNumGenerations = 6;
        this.rollNum = 1;
        this.rollDie = [[0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 3, 4], // 12/12 = 1
                        [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 4], // 16/12 = 1.333
                        [0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 3, 4]]; // 19/12 = 1.583
    }
}

module.exports = Preferences;
