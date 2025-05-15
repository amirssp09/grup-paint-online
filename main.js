let canvas = document.getElementById("drawingCanvas");
let ctx = canvas.getContext("2d");

// تنظیم اندازه کانواس به صورت دینامیک
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 200;

let isDrawing = false;
let currentColor = "#000000";
let lineWidth = 5;

document.getElementById("colorPicker").addEventListener("change", function () {
    currentColor = this.value;
});

document.getElementById("lineWidth").addEventListener("input", function () {
    lineWidth = this.value;
});

canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = "round";
        ctx.stroke();
    }
});
    
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
});

canvas.addEventListener("mouseleave", () => {
    isDrawing = false;
});

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}