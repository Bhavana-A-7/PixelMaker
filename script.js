$("#exportData").click(function () {

    let data = [];

    $(".cell").each(function () {
        data.push($(this).css("background-color"));
    });

    let jsonData = JSON.stringify(data);

    $("#output").val(jsonData);

    // Download file
    let blob = new Blob([jsonData], { type: "application/json" });

    let link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "pixel-art.json";

    link.click();
});