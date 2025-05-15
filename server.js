const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// سرو کردن فایل‌های استاتیک مثل HTML, CSS, JS
app.use(express.static(__dirname));

io.on("connection", (socket) => {
  console.log("user new connect:", socket.id);

  // وقتی کاربر دستور پاک کردن داد
  socket.on("clearCanvas", () => {
    // ارسال دستور پاک کردن برای همه کاربران
    io.emit("clearCanvas");
  });

  // وقتی کاربر شروع به کشیدن خط می‌کند
  socket.on("startLine", (data) => {
    // ارسال به سایر کاربران
    socket.broadcast.emit("receiveStartLine", data);
  });

  // وقتی کاربر در حال نقاشی است
  socket.on("drawing", (data) => {
    // ارسال به سایر کاربران
    socket.broadcast.emit("receiveDrawing", data);
  });

  // وقتی کاربر قطع شد
  socket.on("disconnect", () => {
    console.log("user disconnect:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;// عدد رو میتونیم تغییر بدیم
http.listen(PORT, () => {
  console.log(`سرور در پورت ${PORT} در حال اجراست`);
});
