const ChatRoom = require("../models").chatroom;
const ChatRoomList = require("../models").chatroom_list;
const ChatRoomInfo = require("../models").chatroom_info;
const Chat = require("../models/mongo/chat");

exports.createChatRoom = (chatroomId) => {
       return ChatRoom.create({chatroom_id : chatroomId})
           .catch((err)=>{ console.log("ERROR! ", err); });
};

exports.createChatRoomList = (chatroomId, userId) => {
       return ChatRoomList.create({chatroom_id : chatroomId , user_id : userId, last_update : new Date()})
           .catch((err)=>{ console.log("ERROR! ", err); });
};


exports.insertChatRoomInfo = (chatroomId, title) => {
       return ChatRoomInfo.create({chatroom_id : chatroomId, chatroom_title : title})
           .catch((err)=>{ console.log("ERROR! ", err); });
};

exports.exitChatRoom = (userId, chatroomId) => {
       console.log(userId + " 님이 나가셨습니다.");
       return ChatRoomList.destroy({where : {user_id : userId, chatroom_id : chatroomId}})
           .catch((err)=>{  console.log("ERROR! ", err); });
};

exports.modifyChatRoomTitle = (chatroomId, newTitle) => {
       return ChatRoomInfo.update({chatroom_title : newTitle},{where : {chatroom_id : chatroomId}})
           .catch((err)=>{  console.log("ERROR! ", err); });
};

exports.inviteChatRoom = (chatroomId, userId, friendId) => {
       console.log(userId + " 님이 " + friendId + " 님을 초대하셨습니다.");
       return exports.createChatRoomList(chatroomId, friendId);

};

exports.dropChatRoom = (chatroomId) => {
       console.log(chatroomId + " 채팅방 완전 삭제...");
       const condition = {where : {chatroom_id : chatroomId}};
       (async ()=>{
              ChatRoomList.destroy(condition);
              ChatRoomInfo.destroy(condition);
              ChatRoom.destroy(condition);
       })(this);
};

exports.insertChat = (chatObj) => {
       console.log("채팅 삽입...");
       console.log(chatObj);
       return new Chat.chatModel(chatObj).save();
};

exports.getChats = (chatroomId) => {
       return Chat.chatModel
           .find({})
           .where({chatroom_id : chatroomId})
           .exec();
};