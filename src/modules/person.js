class Person {
    constructor(name, parent, cid){
        this.name = name;
        this.parent = parent;
        this.childID = cid;
        this.children = new Array();
        this.isHeir = false;
        this.houseID = 0;
        this.isHouseHead = false;
        this.x = 0;
        this.y = 0;
        this.mod = 0;
        this.isDisplayed = true;
    }

    matchHouseWithParent(){
        if(!this.isHouseHead && this.parent != null){
            this.houseID = this.parent.houseID;
        }
    }

    getLeftMostSibling(){
        if (this.parent != null){
            return this.parent.children[0];
        }
    }

    getPreviousSibling(){
        if (this.parent != null && this.childID != 0){
            return this.parent.children[this.childID - 1];
        }
    }

    getNextSibling(){
        if (this.parent != null && this.childID != this.parent.children.length-1){
            return this.parent.children[this.childID + 1];
        }
    }

    isLeaf(){
        return this.children.length == 0;
    }

    toString(){
        return this.name;
    }
};

module.exports = Person;
