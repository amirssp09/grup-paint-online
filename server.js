const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static(__dirname));

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("clearCanvas", () => {
        io.emit("clearCanvas");
    });

    socket.on("startLine", (data) => {
        socket.broadcast.emit("receiveStartLine", data);
    });

    socket.on("drawing", (data) => {
        socket.broadcast.emit("receiveDrawing", data);
    });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
