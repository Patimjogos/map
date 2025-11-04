const socket = io();
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const chatBox = document.getElementById("chat-box");
const msgInput =  document.getElementById("msg");

let players = {};
let keys = {};

document.addEventListener("keydown", e => {
    if(e.key == "Enter"){
        chatBox.classList.toggle('hidden');
        msgInput.focus();
    }else{
        keys[e.key] = true;
    }
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

msgInput.addEventListener("keydown", e => {
    if(e.key == "Enter"){
        socket.emit("message", msgInput.value);
        msgInput.value = "";
        chatBox.classList.add('hidden');
    }
});

function loop(){
    if(keys["ArrowLeft"] || keys["a"]){ socket.emit("move", "left")};
    if(keys["ArrowRight"] || keys["d"]){socket.emit("move", "right")};
    if(keys["ArrowUp"] || keys["w"]){socket.emit("move", 'up')};
    if(keys["ArrowDown"] || keys["s"]){socket.emit("move", "down")};
    requestAnimationFrame(loop);
};

loop();

socket.on("UpdatePlayers", data => {
    players = data;
    draw();

});

function draw(){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    for (let id in players){
        const p = players[id];
        ctx.fillStyle = "blue";
        ctx.fillRect(p.x, p.y, 30, 30);
        if(p.msg) {
            ctx.fullStyle = "white";
            ctx.font = "16px Arial";
            ctx.fillText(p.msg, p.x,p.y - 10);
        }
    }
}
