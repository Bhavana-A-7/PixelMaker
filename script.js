$(document).ready(function () {

    let currentColor = $("#colorPicker").val();

    let undoStack = [];

    let redoStack = [];

    let isDrawing = false;

    // ======================
    // CREATE GRID
    // ======================
    function createGrid(rows, cols) {

        $("#grid").empty();

        $("#grid").css({
            "grid-template-columns": `repeat(${cols}, 25px)`
        });

        for (let i = 0; i < rows * cols; i++) {

            $("#grid").append('<div class="cell"></div>');
        }

        undoStack = [];

        redoStack = [];

        saveState();
    }

    // Default Grid
    createGrid(16, 16);

    // ======================
    // SAVE STATE
    // ======================
    function saveState() {

        let state = [];

        $(".cell").each(function () {

            state.push($(this).css("background-color"));
        });

        undoStack.push([...state]);

        if (undoStack.length > 30) {

            undoStack.shift();
        }
    }

    // ======================
    // RESTORE STATE
    // ======================
    function restoreState(state) {

        $(".cell").each(function (index) {

            $(this).css("background-color", state[index]);
        });
    }

    // ======================
    // DRAW START
    // ======================
    $("#grid").on("mousedown", ".cell", function () {

        isDrawing = true;

        saveState();

        $(this).css("background-color", currentColor);

        redoStack = [];
    });

    // ======================
    // DRAW WHILE DRAGGING
    // ======================
    $("#grid").on("mouseenter", ".cell", function () {

        if (isDrawing) {

            $(this).css("background-color", currentColor);
        }
    });

    // ======================
    // STOP DRAWING
    // ======================
    $(document).mouseup(function () {

        isDrawing = false;
    });

    // ======================
    // COLOR PICKER
    // ======================
    $("#colorPicker").change(function () {

        currentColor = $(this).val();
    });

    // ======================
    // CREATE GRID BUTTON
    // ======================
    $("#createGrid").click(function () {

        let rows = parseInt($("#rows").val());

        let cols = parseInt($("#cols").val());

        createGrid(rows, cols);
    });

    // ======================
    // CLEAR GRID
    // ======================
    $("#clearGrid").click(function () {

        saveState();

        $(".cell").css("background-color", "white");

        redoStack = [];
    });

    // ======================
    // UNDO
    // ======================
    $("#undo").click(function () {

        if (undoStack.length > 1) {

            let current = undoStack.pop();

            redoStack.push(current);

            let previous = undoStack[undoStack.length - 1];

            restoreState(previous);
        }
    });

    // ======================
    // REDO
    // ======================
    $("#redo").click(function () {

        if (redoStack.length > 0) {

            let state = redoStack.pop();

            undoStack.push(state);

            restoreState(state);
        }
    });

    // ======================
    // EXPORT PNG
    // ======================
    $("#exportData").click(function () {

        html2canvas(document.querySelector("#grid")).then(canvas => {

            let link = document.createElement("a");

            link.download = "pixel-art.png";

            link.href = canvas.toDataURL();

            link.click();
        });
    });

});