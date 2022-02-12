const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const fs = require('fs');
const io = require('socket.io')(server);

app.use(express.static('src'));

app.get('/', function(req,res){
	fs.readFile('./index3.html', (err, data) =>{
		if(err) throw err;

		res.writeHead(200, {
			'Content-Type' : 'text/html'
		});
		res.write(data);
		res.end();
	});
});

io.sockets.on('connection', function(socket){
	socket.on('newUserConnect', function(name){
		socket.name = name;

		var message = name + '님이 접속했습니다';
		
		io.sockets.emit('updateMessage', {
			name : 'SERVER',
			message : message
		});
	});

	socket.on('joinRoom',function(data){
		console.log(data);
		socket.join(data.roomName);
		roomName = data.roomName;
	});
	socket.on('reqMsg', function(data){
		console.log(data);
		io.socket.in(roomName).emit('reqMsg', {comment: instanceId + " : " + data.comment + "\n"});

	});
});

server.listen(3000, function(){
	console.log('서버 실행중...');
});



