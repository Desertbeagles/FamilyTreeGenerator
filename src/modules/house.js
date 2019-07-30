class House {
    constructor(name){
        this.name = name;
        this.coatOfArms = coatOfArmsGen("german");
    }

    toString(){
        return this.name;
    }
}

module.exports = House;
