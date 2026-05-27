$(document).ready(function () {

    let currentColor = $("#colorPicker").val();

    let mouseDown = false;

    let eyedropperMode = false;

    let undoStack = [];
    let redoStack = [];

    // Create Grid
    function createGrid(rows, cols) {

        $("#grid").empty();

        $("#grid").css({
            "grid-template-columns": `repeat(${cols}, 20px)`
        });

        for (let i = 0; i < rows * cols; i++) {

            let cell = $("<div></div>");
            cell.addClass("cell");

            $("#grid").append(cell);
        }

        saveState();
    }

    createGrid(32, 32);

    // Save State
    function saveState() {

        let state = [];

        $(".cell").each(function () {
            state.push($(this).css("background-color"));
        });

        undoStack.push(state);

        if (undoStack.length > 50) {
            undoStack.shift();
        }
    }

    // Restore State
    function restoreState(state) {

        $(".cell").each(function (index) {
            $(this).css("background-color", state[index]);
        });
    }

    // Mouse events
    $(document).mousedown(function () {
        mouseDown = true;
    });

    $(document).mouseup(function () {
        mouseDown = false;
        saveState();
    });

    // Coloring
    $("#grid").on("mousedown mouseenter", ".cell", function (e) {

        if (e.type === "mousedown" || mouseDown) {

            if (eyedropperMode) {

                let picked = rgbToHex($(this).css("background-color"));

                $("#colorPicker").val(picked);

                currentColor = picked;

                eyedropperMode = false;

            } else {

                $(this).css("background-color", currentColor);
            }
        }
    });

    // Color Picker
    $("#colorPicker").change(function () {
        currentColor = $(this).val();
    });

    // Eyedropper
    $("#eyedropper").click(function () {
        eyedropperMode = true;
    });

    // Create Grid Button
    $("#createGrid").click(function () {

        let rows = $("#rows").val();
        let cols = $("#cols").val();

        createGrid(rows, cols);
    });

    // Undo
    $("#undo").click(function () {

        if (undoStack.length > 1) {

            redoStack.push(undoStack.pop());

            let previous = undoStack[undoStack.length - 1];

            restoreState(previous);
        }
    });

    // Redo
    $("#redo").click(function () {

        if (redoStack.length > 0) {

            let state = redoStack.pop();

            undoStack.push(state);

            restoreState(state);
        }
    });

    // Clear Grid
    $("#clearGrid").click(function () {

        $(".cell").css("background-color", "white");

        saveState();
    });

    // Export Grid Data
    $("#exportData").click(function () {

        let data = [];

        $(".cell").each(function () {
            data.push($(this).css("background-color"));
        });

        $("#output").val(JSON.stringify(data));
    });

    // RGB to HEX
    function rgbToHex(rgb) {

        let values = rgb.match(/\d+/g);

        if (!values) return "#ffffff";

        return "#" + values.slice(0,3).map(x => {
            let hex = parseInt(x).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join('');
    }

});