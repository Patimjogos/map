const { Socket } = require("dgram");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");


const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let players = {};

io.on("connection", socket => {
    console.log("Seja Bem Vindo: jogador ", socket.id);
    console.log("todos os player: ", players);

    players[socket.id] = {
        x: Math.random() * 400,
        y: Math.random() * 400,
        msg: ""
    };

    io.emit("UpdatePlayers", players);

    //movimentos dos players.

    socket.on("move", dir => {
        const p = players[socket.id];
        if(!p) return;
        speed = 5;
        if (dir == "left"){p.x -= speed};
        if (dir == "right"){p.x += speed};
        if (dir == "up"){p.y -= speed};
        if (dir == "down"){p.y += speed};
        io.emit("UpdatePlayers", players);
    });

    socket.on("message", msg => {
        if(players[socket.id]){
            players[socket.id].msg = msg;
            io.emit("UpdatePlayers", players);
            io.emit(console.log(socket.msg));
            setTimeout(() => {
                if(players[socket.id]){
                    players[socket.id].msg = "";
                    io.emit("UpdatePlayers", players);
                }
            }, 3000)
        }

    })



});

socket.on("disconnect", () => {
    delete players[socket.id];
    io.emit("UpdatePlayers", players);
} )


server.listen(3000, () => console.log("ouvindo ...") )