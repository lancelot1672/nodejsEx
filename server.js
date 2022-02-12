var io = require('socket.io').listen(3000);

io.sockets.on('connection', function(socket){
    // on public
    socket.on('join', function (data){
        io.sockets.emit('join', socket.id, data);
    });

    // on broadcast
    socket.on('message', function (data){
        socket.broadcast.emit('message', socket.id, data);
    })

    // on private
    socket.on('whisper', function(id, data, fn){
        if(id && io.sockets.sockets[id]){
            io.sockets.sockets[id].emit('whisper', socket.id, data);
            fn(true);
        }else{
            fn(false);
        }
    });
});