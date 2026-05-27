$(document).ready(function () {

    let currentColor = $("#colorPicker").val();

    let mouseDown = false;

    let eyedropperMode = false;

    let undoStack = [];

    let redoStack = [];

    // =========================
    // CREATE GRID
    // =========================
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

        // Reset history
        undoStack = [];
        redoStack = [];

        saveState();
    }

    // Default Grid
    createGrid(32, 32);

    // =========================
    // SAVE STATE
    // =========================
    function saveState() {

        let state = [];

        $(".cell").each(function () {

            state.push($(this).css("background-color"));
        });

        undoStack.push([...state]);

        // Limit history
        if (undoStack.length > 50) {

            undoStack.shift();
        }

        // Clear redo after new action
        redoStack = [];
    }

    // =========================
    // RESTORE STATE
    // =========================
    function restoreState(state) {

        $(".cell").each(function (index) {

            $(this).css("background-color", state[index]);
        });
    }

    // =========================
    // MOUSE EVENTS
    // =========================
    $(document).mousedown(function () {

        mouseDown = true;
    });

    $(document).mouseup(function () {

        mouseDown = false;

        $(".cell").data("saved", false);
    });

    // =========================
    // DRAWING
    // =========================
    $("#grid").on("mousedown mouseenter", ".cell", function (e) {

        if (e.type === "mousedown" || mouseDown) {

            // Save state BEFORE drawing
            if (!$(".cell").data("drawing")) {

                saveState();

                $(".cell").data("drawing", true);
            }

            // Eyedropper Mode
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

    $(document).mouseup(function () {

        $(".cell").data("drawing", false);
    });

    // =========================
    // COLOR PICKER
    // =========================
    $("#colorPicker").change(function () {

        currentColor = $(this).val();
    });

    // =========================
    // EYEDROPPER
    // =========================
    $("#eyedropper").click(function () {

        eyedropperMode = true;
    });

    // =========================
    // CREATE GRID BUTTON
    // =========================
    $("#createGrid").click(function () {

        let rows = parseInt($("#rows").val());

        let cols = parseInt($("#cols").val());

        createGrid(rows, cols);
    });

    // =========================
    // UNDO
    // =========================
    $("#undo").click(function () {

        if (undoStack.length > 1) {

            let current = undoStack.pop();

            redoStack.push(current);

            let previous = undoStack[undoStack.length - 1];

            restoreState(previous);
        }
    });

    // =========================
    // REDO
    // =========================
    $("#redo").click(function () {

        if (redoStack.length > 0) {

            let state = redoStack.pop();

            undoStack.push(state);

            restoreState(state);
        }
    });

    // =========================
    // CLEAR GRID
    // =========================
    $("#clearGrid").click(function () {

        saveState();

        $(".cell").css("background-color", "white");
    });

    // =========================
    // EXPORT DATA
    // =========================
    $("#exportData").click(function () {

        let data = [];

        $(".cell").each(function () {

            data.push($(this).css("background-color"));
        });

        let jsonData = JSON.stringify(data);

        // Show in textarea
        $("#output").val(jsonData);

        // Download JSON file
        let blob = new Blob([jsonData], {
            type: "application/json"
        });

        let link = document.createElement("a");

        link.href = URL.createObjectURL(blob);

        link.download = "pixel-art.json";

        link.click();
    });

    // =========================
    // RGB TO HEX
    // =========================
    function rgbToHex(rgb) {

        let values = rgb.match(/\d+/g);

        if (!values) return "#ffffff";

        return "#" + values.slice(0, 3).map(x => {

            let hex = parseInt(x).toString(16);

            return hex.length === 1 ? "0" + hex : hex;

        }).join('');
    }

});