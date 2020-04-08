const mongoose=require('mongoose');

const {Schema}=mongoose;
const {Types: {ObjectId}}=Schema;
const chatSchema=new Schema({
  room:{
    type:ObjectId, // room 필드에 Room schema의 ObjectId가 들어간다, JOIN과 비슷한 기능을 할 때 사용
    required:true,
    ref:'Room'
  }, //채팅방 아이디
  user : {
    type:String,
    require:true,
  }, //채팅을 한 사람
  chat:String, //채팅 내역
  gif:String, //GIF 이미지 주소
  createdAt:{
    type:DataCue,
    default:Date.now,
  }, //채팅 시간을 저장
});

module.exports=mongoose.model('Chat', chatSchema);