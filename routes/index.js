const express=require('express');

const Room=require ('../schemas/room');
const Chat=require ('../schemas/chat');

const router=express.Router();

router.get('/', async(req, res, next) => {
  try{
    const rooms=await Room.find({});
    res.render('main', {rooms, title : 'GIF 채팅방', error:req.flash('roomError')});
  }catch(error){
    console.error(error);
    next(error);
  }
});

router.get('/room', (req, res)=>{
  res.render('room', {title : 'GIF 채팅방 생성'});
});
router.post('/room', async(req, res, next)=>{
  try{
    const room = new Room({
      title : req.body.title,
      max : req.body.max,
      owner : req.session.color,
      password : req.body.password,
    });
    const newRoom = await room.save(); //??
    const io=req.app.get('io'); // io 객체 사용
    io.of('/room').emit('newRoom', newRoom); // '/room' 네임스페이스에 연결한 모든 클라이언트에게 데이터를 보낸다
    res.redirect(`/room/${newRoom._id}?password=${req.body.password}`); //??
  }catch(error){
    console.error(error);
    next(error);
  }
}); //채팅방을 만드는 라우터

router.get('/room/:id', async(req, res, next)=>{
  try{
    const room=await Room.findOne({id: req.params.id});
    const io=req.app.get('io');
    if(!room ){
      req.flash('roomError', '존재하지 않는 방입니다');
      return res.redirect('/');
    }
    if(room.password && room.password!==req.query.password){
      req.flash('roomError', '비밀번호가 틀렸습니다.');
      return res.redirect('/');
    }
    const{rooms}=io.of('/chat').adapter;

    
  }catch(error){
    console.error(error);
    return next(error);
  }
});

module.exports=router;