let express = require('express');
let app = express();
let serv = require('http').Server(app);

let currentColor = 'white';

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/client/index.html');
    //res.sendFile(__dirname + '/img/smith.webp');
});

app.use('/client', express.static(__dirname + '/client'));

serv.listen(2000);
console.log("Server started.")

function randomColor() {
    return "rgb(" + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + "," + Math.floor(Math.random() * 256) + ")";
}

let PLAYER_LIST = {};
let allID = 0;

let io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
    console.log("SOCKET CONNECTION");
    let player = {};
    player.id = socket.id;
    player.color = randomColor();
    player.x = 0;
    player.y = 0;
    player.lastX = 0;
    player.lastY = 0;
    PLAYER_LIST[player.id] = player;

    socket.emit('init', PLAYER_LIST);

    socket.on('move', function(data){
        let player = PLAYER_LIST[data.id];
        player.lastX = player.x;
        player.lastY = player.y;
        player.x = data.newX;
        player.y = data.newY;
        console.log(data.id + " moved");
    });

    socket.on('disconnect', function(){
        console.log("SOCKET DISCONNECT");
        delete PLAYER_LIST[socket.id];
    });
});

setInterval(function(){
    console.log('tick');
    io.emit('tick', PLAYER_LIST);

    /*for(let i in SOCKET_LIST){
        let socket = SOCKET_LIST[i];

    }*/

}, 32);