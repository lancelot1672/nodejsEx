// https://do-dam.tistory.com/122 실시간 멀티 채팅 만들기

var app = require('express')(); // express 모듈 요청하여 http 객체에 담아 핸들링
var http = require('http').createServer(app);   // 서버 생성 및 제어
var io = require('socket.io')(http)

// 웹 사이트를 방문시 호출 되는 경로
app.get('/', function(req, res){
    res.sendFile(__dirname + "/index4.html");
});

// connect event
io.on('connection',function(socket){
    console.log('user connected');

     // disconnect event
    socket.on('disconnect', function(){
    console.log('user disconnected');
  });

    // chat message Tag
    socket.on('chat message', function(msg){
        console.log('message : ' + msg);

        //브로드 캐스팅
        //socket.broadcast.emit('chat message', msg);
        
        //io.emit 가 암됌..

        // public
        io.sockets.emit('chat message', msg);

    });
});

// http 서버가 포트 3000에서 수신 대기
http.listen(3000, function(){
    console.log('listening on *:3000');
});
