var heirCalc = false;
var maxGenDepth = 0;

class Tree {
    constructor(culture, size) {
      this.culture = culture;
      this.size = size;
      this.fnames = loadNameFile('german', 'first', 'boys.json');
      this.hnames = loadNameFile('german', 'house', 'houses.json');
      this.rootPerson = new Person(this.fnames[Math.floor(Math.random()*this.fnames.length)], null, 0);
      this.full = false;
      this.numPeople = 1;
      this.houses = new Array();
    }

    setup(){
        heirCalc = false;
        maxGenDepth = 0;
        this.houses[0] = new House(this.hnames[Math.floor(Math.random()*this.hnames.length)], this.culture);
        this.full = false;
        while(!this.full){
            this.generateChildren(this.rootPerson, 1);
        }
        this.calculateHeirs(this.rootPerson, 1);
        this.calculateHouses(this.rootPerson);
        this.matchHouses(this.rootPerson);
        this.cleanTree(this.rootPerson);
        Calc.calcInitalX(this.rootPerson);
        Calc.checkAllChildrenOnScreen(this.rootPerson);
        Calc.calculateFinalPositions(this.rootPerson, 0);
        this.fnames = null;
        this.hnames = null;
        console.log("\n Generated Family Tree Containing: " + calcSizeOfTree(this.rootPerson) + " people\n");
        console.log("\n Root = " + this.rootPerson.name + " with children " + this.rootPerson.children + " \n");
    }

    generateChildren(rootP, currentGen){
        if (currentGen < this.size){
            // var numChildren = Math.floor((Math.random() * birthRate) + 0);
            var numChildren = this.rollChildren();
            for(var i = 0; i < numChildren; i++){
                rootP.children[i] = new Person(this.fnames[Math.floor(Math.random()*this.fnames.length)], rootP, i);
                rootP.children[i].y = currentGen;
                this.numPeople++;
                //if(currentGen < this.size){
                this.generateChildren(rootP.children[i], currentGen+1);
                //}
            }
        }
        else if (currentGen == this.size) {
            this.full = true;
        }
    }

    cleanTree(rootPerson){
        var size = calcSizeOfTree(rootPerson);
        if(!containsHeir(rootPerson) && size > 20 && this.numPeople > 50){
            toggleDisplay(rootPerson);
            rootPerson.isDisplayed = true;
            console.log("\n [cleanTree] Cleaned tree of " + rootPerson + " containing: " + calcSizeOfTree(rootPerson) + " people \n");
            rootPerson.name += " (" + size + ")";
        }
        else {
            for (var i = 0; i < rootPerson.children.length; i++){
                this.cleanTree(rootPerson.children[i]);
            }
        }
    }

    rollChildren(){
        var array = [0, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3, 4];
        return array[Math.floor((Math.random() * 12) + 0)];
    }

    calculateHouses(rootPerson){
        if(rootPerson.getPreviousSibling() != null){
            if(rootPerson.getPreviousSibling().isHeir && calcSizeOfTree(rootPerson) > 10){
                rootPerson.houseID = this.houses.length;
                rootPerson.isHouseHead = true;
                this.houses[rootPerson.houseID] = new House(this.hnames[Math.floor(Math.random()*this.hnames.length)], this.culture);
            }
        }
        for (var i = 0; i < rootPerson.children.length; i += 1){
            this.calculateHouses(rootPerson.children[i]);
        }
    }

    calculateHeirs(rootPerson, currentGen){
        if(!heirCalc){
            rootPerson.isDisplayed = true;
            rootPerson.getNextSibling.isDisplayed = true;
            if(currentGen > maxGenDepth){
                rootPerson.isHeir = true;
                maxGenDepth = currentGen;
                // if(currentGen > 5 && (!rootPerson.parent.isHeir) && (!rootPerson.parent.parent.isHeir)){
                //     rootPerson.parent.parent.houseID = this.houses.length;
                //     rootPerson.parent.parent.isHouseHead = true;
                //     this.houses[rootPerson.parent.parent.houseID] = new House(this.hnames[Math.floor(Math.random()*this.hnames.length)], this.culture);
                // }
            }
            console.log("\n [calculateHeirs] " + rootPerson.name + " is an heir \n");
            if (currentGen == this.size){
                console.log("\n [calculateHeirs] Heir Found \n");
                heirCalc = true;
                rootPerson.isHeir = true;
                // console.log("\n [calculateHeirs] " + rootPerson.name + " is an heir \n");
                // return true;
            }
            else if(rootPerson.children.length == 0){
                return false;
            }
            var isDone = false;

            for (var i = 0; i < rootPerson.children.length && !isDone; i += 1){
                if(!isDone && (((rootPerson.children[i].children.length > 0) || (currentGen + 1 == this.size)) || i == 0)){
                    isDone = this.calculateHeirs(rootPerson.children[i], currentGen + 1);
                }
            }
        }

    }

    matchHouses(rootPerson){
        rootPerson.matchHouseWithParent();
        for (var i = 0; i < rootPerson.children.length; i++){
            this.matchHouses(rootPerson.children[i]);
        }
    }

    draw(){
        Display.displayTree(this.rootPerson);
    }
};

function calcSizeOfTree(rootPerson){
    if (rootPerson.children.length == 0){
        return 1;
    }
    var size = 0;
    for(var i = 0; i < rootPerson.children.length; i++){
        size += calcSizeOfTree(rootPerson.children[i]);
    }
    return size + 1;
}


var foundHeir;
function containsHeir(rootPerson){
    if(rootPerson.isHeir){
        return true;
    }
    foundHeir = false;
    for(var i = 0; i < rootPerson.children.length; i++){
        containsHeirHelper(rootPerson.children[i]);
    }
    return foundHeir;
}

function containsHeirHelper(rootPerson){
    if (rootPerson.isHeir){
        foundHeir = true;
        return;
    }
    else if (rootPerson.children.length == 0){
        return;
    }
    else {
        for(var i = 0; i < rootPerson.children.length; i++){
            containsHeirHelper(rootPerson.children[i]);
        }
    }
}

function toggleDisplay(rootPerson){
    if(!rootPerson.isHeir){
        rootPerson.isDisplayed = false;
    }
    for(var i = 0; i < rootPerson.children.length; i++){
        toggleDisplay(rootPerson.children[i]);
    }
}

module.exports = Tree;
