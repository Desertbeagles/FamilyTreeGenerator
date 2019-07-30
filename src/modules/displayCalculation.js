var nodeSize = 1;
var siblingDistance = 0;
var treeDistance = 0;

module.exports = {
    calcInitalX: function (personObj) {
        if (personObj == null || !personObj.isDisplayed) {
            return;
        }
        for (var i = 0; i < personObj.children.length; i++) {
            Calc.calcInitalX(personObj.children[i]);
        }
        //
        if (personObj.isLeaf()) {
            if (!(personObj.childID == 0)) {
                personObj.x = personObj.getPreviousSibling().x + nodeSize + siblingDistance;
            } else {
                personObj.x = 0;
            }
        } else if (personObj.children.length == 1) {

            if (personObj.childID == 0) {
                personObj.x = personObj.children[0].x;
            } else {
                personObj.x = personObj.getPreviousSibling().x + nodeSize + siblingDistance;
                personObj.mod = personObj.x - personObj.children[0].x;
            }
        } else {
            var leftChild = personObj.children[0];
            var rightChild = personObj.children[personObj.children.length - 1];
            var mid = (leftChild.x + rightChild.x) / 2;

            if (personObj.childID == 0) {
                personObj.x = mid;
            } else {
                personObj.x = personObj.getPreviousSibling().x + nodeSize + siblingDistance;
                personObj.mod = personObj.x - mid;
            }
        }

        if (personObj.children.length > 0 && !(personObj.childID == 0)) {
            Calc.checkForConflicts(personObj);
        }
    },

    checkForConflicts: function (personObj) {
        if (personObj == null || !personObj.isDisplayed) {
            return;
        }
        var minDistance = treeDistance + nodeSize;
        var shiftValue = 0;

        var nodeContour = new Object();
        Calc.getLeftContour(personObj, 0, nodeContour);

        var sibling = personObj.getLeftMostSibling();
        while (sibling != null && sibling != personObj) {
            var siblingContour = new Object();
            Calc.getRightContour(sibling, 0, siblingContour);

            for (var level = personObj.y + 1; level <= Math.min(Math.max(...Object.keys(siblingContour).map(Number)), Math.max(...Object.keys(nodeContour).map(Number))); level++) {
                var distance = nodeContour[level] - siblingContour[level];
                if (distance + shiftValue < minDistance) {
                    shiftValue = minDistance - distance;
                }
            }

            if (shiftValue > 0) {
                personObj.x += shiftValue;
                personObj.mod += shiftValue;

                Calc.centerNodesBetween(personObj, sibling);

                shiftValue = 0;
            }

            sibling = sibling.getNextSibling();
        }
    },

    centerNodesBetween: function (leftPerson, rightPerson) {
        var leftIndex = leftPerson.childID;
        var rightIndex = rightPerson.childID;

        var numPplBetween = (rightIndex - leftIndex) - 1;

        if (numPplBetween > 0) {
            var distanceBetweenPeople = (leftPerson.x - rightPerson.y) / (numPplBetween + 1);

            var count = 1;
            for (var i = leftIndex + 1; i < rightIndex; i++) {
                var middlePerson = leftPerson.parent.children[i];

                var desiredX = rightPerson.x + (distanceBetweenPeople * count);
                var offset = desiredX - middlePerson.x;
                middlePerson.x += offset;
                middlePerson.mod += offset;

                count++;
            }

            Calc.checkForConflicts(leftPerson);
        }
    },

    checkAllChildrenOnScreen: function (personObj) {
        if (personObj == null || !personObj.isDisplayed) {
            return;
        }
        var nodeContour = new Object();
        Calc.getLeftContour(personObj, 0, nodeContour);

        var shiftAmount = 0;
        for (var i = 0; i < Object.keys(nodeContour).length; i++) {
            if (nodeContour[Object.keys(nodeContour)[i]] + shiftAmount < 0) {
                shiftAmount = (nodeContour[Object.keys(nodeContour)[i]] * -1);
            }
        }

        if (shiftAmount > 0) {
            personObj.x += shiftAmount;
            personObj.mod += shiftAmount;
        }
    },

    getLeftContour: function (personObj, modSum, values) {
        if (personObj == null || !personObj.isDisplayed) {
            return;
        }
        if (values[personObj.y] == undefined) {
            values[personObj.y] = personObj.x + modSum;
        } else {
            values[personObj.y] = Math.min(values[personObj.y], personObj.x + modSum);
        }

        modSum += personObj.mod;
        for (var i = 0; i < personObj.children.length; i++) {
            Calc.getLeftContour(personObj.children[i], modSum, values);
        }
    },

    getRightContour: function (personObj, modSum, values) {
        if (personObj == null || !personObj.isDisplayed) {
            return;
        }
        if (values[personObj.y] == undefined) {
            values[personObj.y] = personObj.x + modSum;
        } else {
            values[personObj.y] = Math.max(values[personObj.y], personObj.x + modSum);
        }

        modSum += personObj.mod;
        for (var i = 0; i < personObj.children.length; i++) {
            Calc.getRightContour(personObj.children[i], modSum, values);
        }
    },

    calculateFinalPositions: function (personObj, modSum) {
        if (personObj == null || !personObj.isDisplayed) {
            return;
        }
        personObj.x += modSum;
        modSum += personObj.mod;

        for (var i = 0; i < personObj.children.length; i++) {
            Calc.calculateFinalPositions(personObj.children[i], modSum);
        }
    }
};
