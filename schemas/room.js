const mongoose=requir('mongoose');

const {Schema}=mongoose;
const roomSchema=new Schema({
  title:{
    type: String,
    rqruired:true,
  }, //방 제목
  max:{
    type:Number,
    required: true,
    default:10, //기본 수용 인원 10명
    min:2, //최소 인원 2명
  }, // 최대 인원 수용
  owner :{
    type:String,
    required:true,
  }, // 방장
  password:String, //비밀번호
  createdAt:{
    type:Date,
    default:Date.now,
  }, //생성시간
});

module.exports=mongoose.model('Room',roomSchema);