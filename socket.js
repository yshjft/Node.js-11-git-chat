SocketIO =require('socket.io')

module.exports=(server, app, sessionMiddleware)=>{
  const io=SocketIO(server, {path : '/socket.io'});
  app.set('io', io);
  const room=io.of('/room'); 
  const chat=io.of('/chat'); 
  //네임스페이스 부여, 같은 네임스페이스끼리만 데이터를 전달, 기본적으로 / 네임스페이스를 제공하나 다른 of 메서드를 사용하여 다른 네임스페이스 만든다
  //지정된 네임스페이스에 연결한 크라이언트들에게만 데이터를 전달

  io.use((socket, next)=>{
    sessionMiddleware(socket.request, socket.request.res, next);
  });
  room.on('connection', (socket)=>{
    console.log('room 네임스페이스에 접속');
    socket.on('disconnect', ()=>{
      console.log('room 네임스페이스 접속 해제');
    });
  });
  chat.on('connection', (socket)=>{
    console.log('chat 네임스페이스에 접속');
    const req=socket.request;
    const {headers: {referer}}=req;
    //같은 네임스페이스+같은 방에 있는 socket이여만 데이터 전달 가능
    const roomId=referer
      .split('/')[referer.split('/').length-1]
      .replace(/\?.+/, '');
    socket.join(roomId); //들어감
    socket.to(roomId).emit('join', {
      user: 'system',
      chat: `${req.session.color}님이 입장하셨습니다.`
    });//특정 방으로 데이터 전달
    socket.on('disconnect', ()=>{
      console.log('chat 네임스페이스 접속 해제');
      soeckt.leave(roomId); //나감
      const currentRoom=socket.adapter.rooms[roomId]; //참여 중인 socket 정보
      const userCount= currentRoom ? currentRoom.length : 0;
      if(userCount === 0){
        axios.delete(`http://localhost:8052/room/${roomId}`)
          .then(()=>{
            console.log('방 제거 요청 성공');
          })
          .catch((error)=>{
            console.error(error);
          });
      }else{
        Socket.to(roomId).emit('exit', {
          user:'system',
          chat:`${req.session.color}님이 퇴장하셨습니다.`,
        });
      }
    });
  });
};