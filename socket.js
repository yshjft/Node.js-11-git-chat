// const WebSocket=require('ws');

// module.exports=(server)=>{
//   const wss=new WebSocket.Server({server}); // 익스프레스 서버를 웹 소켓 섭와 연결

//   wss.on('connection', (ws, req)=>{
//     const ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress; //클라이언트의 IP를 알아내는 방법
//     console.log('새로운 클라이언트 접속', ip);
//     ws.on('message', (message)=>{
//       console.log(message);
//     });
//     ws.on('error', (error)=>{
//       console.error(error);
//     });
//     ws.on('close', ()=>{
//       console.log('클라이언트 접속 해제', ip);
//       clearInterval(ws.interval); //없으면 메모리 누수, 메모리 누수(memory leak) 현상은 컴퓨터 프로그램이 필요하지 않은 메모리를 계속 점유하고 있는 현상
//     });
//     const interval=setInterval(()=>{
//       if(ws.readyState === ws.OPEN){
//         ws.send('서버에서 클라이언트로 메세지를 보냅니다.');
//       }
//     }, 3000);
//     ws.interval=interval;
//   });
// };
const SocketIO =require('socket.io')

// module.exports=(server)=>{
//   const io=SocketIO(server, {path : '/socket.io'});

//   io.on('connection', (socket)=>{
//     const req=socket.request;
//     const ip=req.headers['x-forwarded-for'] || req.connection.remoteAddress; //클라이언트의 IP를 알아내는 방법
//     console.log('새로운 클라이언트 접속!', ip, socket.id, req.id);
    
//     socket.on('disconnect', ()=>{
//       console.log('클라이언트 접속 해제', ip, socket.id);
//       clearInterval(socket.interval);
//     });
//     socket.on('error', (error)=>{
//       console.error(error);
//     });
//     socket.on('reply', (data)=>{
//       console.log(data);
//     });
//     socket.interval=setInterval(()=>{
//       socket.emit('news', 'Hello Socket.io');
//     }, 3000);
//   });
// };

module.exports=(server, app)=>{
  const io=SocketIO(server, {path : '/socket.io'});
  app.set('io', io);
  const room=io.of('/room'); //네임스페이스 부여, 같은 네임스페이스끼리만 데이터를 전달
  const chat=io.of('/chat'); //네임스페이스 부여
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
    const roomId=referer
      .split('/')[referer.split('/').length-1]
      .replace(/\?.+/, '');
    socket.join(roomId);
    socket.on('disconnect', ()=>{
      console.log('chat 네임스페이스 접속 해제');
      soeckt.leave(roomId);
    });
  });
};