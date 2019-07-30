
module.exports = {
    displayTree: function (rootPerson) {
        if (frame < preferences.frameRate && preferences.frameRateToggle) {
            numSkips++;
            frame++;
        } else {
            canvas.width = window.innerWidth * preferences.zoomMod;
            canvas.height = window.innerHeight * preferences.zoomMod;
            ctx.scale(widthCanvas / widthView, heightCanvas / heightView);
            ctx.translate(-xleftView, -ytopView);
            numRedraws++;

            ctx.textAlign = "center";
            ctx.drawImage(tree.houses[rootPerson.houseID].coatOfArms, rootPerson.x * 70 - 19, rootPerson.y * 60 - 90, 38, 38);
            ctx.fillText("House of " + tree.houses[rootPerson.houseID], rootPerson.x * 70, rootPerson.y * 60 - 38);

            ctx.textAlign = "left";
            ctx.fillText("Generation:", xleftView + 10, rootPerson.y * 60 - 38);
            for (var i = 0; i < tree.size; i++) {
                ctx.fillStyle = colors[(i + 1) % 6];
                ctx.fillText(i + 1, xleftView + 10, 60 * i);
            }

            function draw(rootPerson, genNum) {
                if (!rootPerson.isDisplayed) {
                    return;
                }
                var x = rootPerson.x * 70;
                var y = rootPerson.y * 60;

                // if(rootPerson.isHouseHead){
                //     ctx.textAlign = "center";
                //     ctx.drawImage(tree.houses[rootPerson.houseID].coatOfArms, rootPerson.x * 70 - 12, rootPerson.y * 60 - 80, 24, 24);
                //     ctx.fillText("House of " + tree.houses[rootPerson.houseID], rootPerson.x * 70, rootPerson.y * 60 - 38);
                // }

                if (rootPerson.isHeir) {
                    ctx.strokeStyle = '#ffa000';
                }
                ctx.fillStyle = 'lightgray';
                ctx.beginPath();
                ctx.arc(x, y - 3, 15, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                ctx.globalCompositeOperation = "source-atop";
                ctx.drawImage(tree.houses[rootPerson.houseID].coatOfArms, x - 16, y - 20, 32, 32);
                ctx.globalCompositeOperation = "source-over";
                ctx.beginPath();
                ctx.arc(x, y - 3, 15, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.strokeStyle = 'black';
                var boxWidth = 30 + rootPerson.name.length * 2.2

                ctx.beginPath();
                ctx.rect(x - (boxWidth / 2), y + 3, boxWidth, 10);
                ctx.fill();
                ctx.stroke();

                ctx.fillStyle = colors[genNum % 6];
                ctx.textAlign = "center";
                ctx.fillText(rootPerson.name, x, y + 11.5);

                if (rootPerson.isHeir) {
                    ctx.drawImage(img, x - 14, y - 26, 13, 13);
                }


                for (var j = 0; j < rootPerson.children.length; j++) {
                    draw(rootPerson.children[j], genNum + 1);
                    if (!rootPerson.children[j].isDisplayed) {
                        return;
                    }
                    ctx.beginPath();

                    var newx = rootPerson.children[j].x * 70;
                    var newy = rootPerson.children[j].y * 60;
                    ctx.moveTo(x, y + 13);
                    ctx.lineTo(x, newy - 30);

                    ctx.moveTo(x, newy - 30);
                    ctx.lineTo(newx, newy - 30);

                    ctx.moveTo(newx, newy - 30);
                    ctx.lineTo(newx, newy - 18);

                    ctx.stroke();
                }
            }


            draw(rootPerson, 1);
            frame = 0;
            console.log("\n [displayTree] Number of Skips: " + numSkips + " , Number of Redraws: " + numRedraws + "\n");
        }
    }
};

var colors = ["blue", "green", "red", "purple", "black", "brown"]
var numRedraws = 0;
var numSkips = 0;
