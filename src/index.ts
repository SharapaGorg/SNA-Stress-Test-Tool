import {io} from "socket.io-client";

const socket = io("http://localhost:3000");

socket.on('pong', () => {
    console.log('RECEIVED PONG');
})

setTimeout(() => {
    socket.emit('ping');
}, 1000)
