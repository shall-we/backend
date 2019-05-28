const assert = require("assert");
const uuidv4 = require('uuid/v4');
const chatRoomApi = require('../api/chat');

const mongoose = require('mongoose');
const MONGO_URL = 'mongodb://wespace:wespace@15.164.154.155:27983/wespace';

describe('chat testing... Query', ()=>{

    before(()=>{

        mongoose.connect(MONGO_URL, {
            useNewUrlParser:true,
            autoReconnect : true
        }, 60000)
            .then(() => {

            }, (err)=>{
                console.log(err);
            });
    });



    it('Create Chatroom', async ()=>{
        const chatroomId = uuidv4();
        const userId = 2;
        const title = "채팅방";
        await chatRoomApi.createChatRoom(chatroomId);
        await chatRoomApi.createChatRoomList(chatroomId, userId);
        await chatRoomApi.insertChatRoomInfo(chatroomId, title);
    });

    const chatroomId = "75dea450-f565-44ee-add0-0c45ec6d39d2";

    it('Invite Chatroom', ()=>{
        const friendId = 3;
        const userId = 2;

        assert(chatRoomApi.inviteChatRoom(chatroomId, userId, friendId));

    });


    it('Exit Chatroom', async ()=>{
        const userId = 2;
        await chatRoomApi.exitChatRoom(userId, chatroomId);


    });

      it('Modify Chatroom Title', async ()=>{

          const newChatroomTitle = "김기덕의 채팅방";
          await chatRoomApi.modifyChatRoomTitle(chatroomId, newChatroomTitle);

      });


    it('Drop Chatroom', async ()=>{
        const result = await chatRoomApi.dropChatRoom(chatroomId);
        console.log(result);

    });

    it('Insert Chat', async ()=>{
        let chatObj = {
            chatroom_id : chatroomId,
            sender : 2,
            content : "testing...",
            viewer : [],
            send_date : new Date()
        };
        await chatRoomApi.insertChat(chatObj).then(result=>{
            console.log(result);
            console.log("삽입 성공...");
        });
    });

        it('get Chat', async ()=>{
            console.log("test");

          let result = await chatRoomApi.getChats(chatroomId);
            console.log(result);

        });



});


/*describe('chat testing... Socket', ()=> {

    it('Socket Chat test...', ()=>{
        assert.fail("소켓 실패");
    });

});*/
