module.exports = {

    handleMouseWheel: function (event) {
        var x = widthView / 2 + xleftView; // View coordinates
        var y = heightView / 2 + ytopView;
        console.log("\n [HandleMouseWheel] x = " + x + " and y = " + y + " \n");

        var scale = (event.wheelDelta < 0 || event.detail > 0) ? 1.1 : 0.9;
        widthView *= scale;
        heightView *= scale;

        if (widthView > widthViewOriginal || heightView > heightViewOriginal) {
            widthView = widthViewOriginal;
            heightView = heightViewOriginal;
            x = widthView / 2;
            y = heightView / 2;
        }

        // scale about center of view, rather than mouse position. This is different than dblclick behavior.
        xleftView = x - widthView / 2;
        ytopView = y - heightView / 2;

        frame = preferences.frameRate;
        if(tree != null){
            tree.draw();
        }
    },

    handleMouseDown: function (event) {
        mouseDown = true;
        console.log("\n [Mouse] Down \n");
    },

    handleMouseUp: function (event) {
        mouseDown = false;
        console.log("\n [Mouse] Up \n");
    },

    handleMouseMove: function (event) {
        // var X = event.clientX - this.offsetLeft - this.clientLeft + this.scrollLeft;
        // var Y = event.clientY - this.offsetTop - this.clientTop + this.scrollTop;
        var p = screen.getCursorScreenPoint();
        var X = p.x;
        var Y = p.y;

        if (mouseDown) {
            var dx = (X - lastX) / widthCanvas * widthView;
            var dy = (Y - lastY) / heightCanvas * heightView;
            if (dx != 0 || dy != 0) {
                xleftView -= dx;
                ytopView -= dy;
                if(tree != null){
                    tree.draw();
                }
            } else {
                console.log("dy and dx 0");
            }
        }
        lastX = X;
        lastY = Y;
    }
};

var mouseDown = false;
var lastX = 0;
var lastY = 0;
