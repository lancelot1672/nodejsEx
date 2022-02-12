var socket = io();
socket.on('connect', function(){
	console.log('connect');
	var name = prompt('대화명을 입력해주세요.','');
	socket.emit('newUserConnect',name);
});
socket.on('updateMessage', function(data){
	var infoEl = document.getElementById('info');
	infoEl.innerHTML = data.message;
});
