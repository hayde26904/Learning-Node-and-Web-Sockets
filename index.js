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

let SOCKET_LIST = {};
let allId = 0;

let io = require('socket.io')(serv, {});
io.sockets.on('connection', function(socket) {
    console.log('socket connection');
    socket.id = allId++;
    socket.color = randomColor();
    socket.x = 0;
    socket.y = 0;
    SOCKET_LIST[socket.id] = socket;

    socket.emit('init', {
        id: socket.id,
        color: socket.color,
    });
    
});

setInterval(function(){

    io.emit('tick', {SOCKET_LIST});

    /*for(let i in SOCKET_LIST){
        let socket = SOCKET_LIST[i];

    }*/

}, 1000/25);