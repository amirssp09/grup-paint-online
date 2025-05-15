// متصل شدن به سرور Socket.IO
const socket = io();

let canvas = document.getElementById("drawingCanvas");
let ctx = canvas.getContext("2d");

// تنظیم اندازه کانواس
canvas.width = window.innerWidth - 40;
canvas.height = window.innerHeight - 200;

let isDrawing = false;
let currentColor = "#000000";
let lineWidth = 5;

// انتخاب رنگ
document.getElementById("colorPicker").addEventListener("change", function () {
    currentColor = this.value;
});

// تنظیم ضخامت خط
document.getElementById("lineWidth").addEventListener("input", function () {
    lineWidth = this.value;
});

// وقتی کاربر شروع به کشیدن می‌کنه
canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    // شروع یک خط جدید
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
    // ارسال اولین نقطه به سرور
    socket.emit("startLine", {
        x: e.offsetX,
        y: e.offsetY,
        color: currentColor,
        width: lineWidth,
    });
});

// حرکت ماوس در حین کشیدن
canvas.addEventListener("mousemove", (e) => {
    if (isDrawing) {
        // ادامه خط و ارسال به سرور
        socket.emit("drawing", {
            x: e.offsetX,
            y: e.offsetY,
            color: currentColor,
            width: lineWidth,
        });
        drawLine(e.offsetX, e.offsetY); // رسم خط در کانواس محلی
    }
});

// خاتمه کشیدن نقاشی
canvas.addEventListener("mouseup", () => {
    isDrawing = false;
    ctx.closePath();
});

// وقتی کاربر از کانواس خارج می‌شود
canvas.addEventListener("mouseout", () => {
    isDrawing = false; // متوقف کردن نقاشی
});

// دریافت شروع یک خط جدید از دیگران
socket.on("receiveStartLine", (data) => {
    ctx.beginPath();
    ctx.moveTo(data.x, data.y);
});

// دریافت نقاط خط از دیگران
socket.on("receiveDrawing", (data) => {
    drawLine(data.x, data.y, data.color, data.width);
});

// تابع رسم خط
function drawLine(x, y, color = currentColor, width = lineWidth) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineTo(x, y);
    ctx.lineCap = "round";
    ctx.stroke();
}

// پاک کردن کانواس
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clearCanvas"); // ارسال به سرور برای پاک کردن کانواس همه کاربران
}

// دریافت دستور پاک کردن از سرور
socket.on("clearCanvas", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // پاک کردن کانواس محلی
});