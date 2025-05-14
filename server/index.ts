import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";

const PORT = process.env.PORT || 3000;
const __prod = process.env.NODE_ENV === "production";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: __prod ? "" : "http://localhost:5173",
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type"],
    },
});

io.on("connection", (socket) => {
    console.log("Client connected");
})

httpServer.listen(PORT, () => {
    if (__prod) {
        console.log(
            `(Production Mode) Client and server is running under http://localhost:${PORT}`
        );
    } else {
        console.log(`Server is running under development port ${PORT}`);
    }
});
