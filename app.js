const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const cookieParser = require('cookie-parser');
const mysql_db = require('./models/index');
const redis = require("redis");
const mongoose = require('mongoose');
const redisClient = redis.createClient();
const redisWork = require("./lib/redisWork");
const url = require('url');
const cors = require('cors');
/*
const user = require("./api/user");
*/
const friend = require("./api/friend");
const chatRoomApi = require("./api/chat");


const MONGO_URL = 'mongodb://wespace:wespace@15.164.154.155:27983/wespace';
mongoose.connect(MONGO_URL, {
  useNewUrlParser:true,
  autoReconnect : true
}, 60000)
    .then(msg => {
      console.log("mongodb 접속 성공!");
      console.log(msg);
      (async ()=>{
        const chatroomId = "75dea450-f565-44ee-add0-0c45ec6d39d2";
        let result = await chatRoomApi.getChats(chatroomId);
        console.log(result);

      })();

    })
    .catch(err => {
      console.log("mongodb 접속 실패..");
      console.log(err);
});

redisClient.on("error", (err) => console.log('redis 구동중 문제 발생.. ', err));
redisClient.on("connect", ()=>{
  console.log("redis 준비 완료. 설정 끝..");
  redisClient.flushall((err, result)=>{
    if(result === "OK") console.log("redis key 초기화 완료");

   friend.searchAllFriendByOptions().then(allFriends => {
     allFriends.forEach(el=>{
       redisWork.setObserver(redisClient, el.dataValues.friend_id, el.dataValues.user_id);
     });
     console.log("observer list 초기화 완료");


   });

  });
});


const app = express();

const server = require('http').Server(app);


app.use(cors({ origin: '*' }));
//소켓통신
const socketio=require('socket.io');
const io = socketio.listen(server);

io.on('connection',(socket)=>{
  console.log('사용자 접속::' + socket.client.id);

socket.on('disconnect', (reason)=>{
    redisWork.disconnect(io, redisClient, socket.client.id)
        .catch(err => {
      console.warn(err);
    });
  });


  socket.on('join', (msg) => {
    msg.socketId = socket.client.id;
    //사용자의 친구 목록을 뽑아오고, 해당 사용자를 현재 접속자인 activeUser로 설정
    msg.friends = friend.searchAllFriend({user_id : msg.id}).then(friends => {
      console.log("가져온 친구 목록...");
      console.log(friends);
      friends = friends.map((friend)=>{
        return friend.dataValues.friend_id;
      });
      msg.friends = friends;
      redisWork.setActiveUser(io, redisClient, msg);

    });
  });

  socket.on('updateFolderList',(msg)=>{

    console.log('메세지::',msg);
    io.emit('updateFolderList',msg);
  
  });
  socket.on('updateNoteList',(msg)=>{

    console.log('메세지::',msg);
    io.emit('updateNoteList',msg);

  });


  socket.on('getFriendList', (msg) => {

    const query = "select b.id, b.name, b.profile from friend_list a, user b where a.friend_id = b.id and a.user_id = :id";
    const params = {id : msg.id};
    friend.searchAllFriendByRawQuery(query, params).spread((result, metadata)=>{

      let friendList = result.map(async (el)=>{
        let data = {};
        data.joined = !!(await redisWork.getActiveUser(redisClient, el.id));
        return Object.assign(data, el);
      });

      Promise.all(friendList).then((result)=>{
        io.sockets.connected[socket.client.id].emit('getFriendList', result);
      });


    });

/*    friend.searchAllFriend({user_id : msg.id}).then((result) => {

      let friendList =  result.map(async (el)=>{
      let data = el.dataValues;
          data.friendInfo = data.user.dataValues;
          data.joined = !!(await redisWork.getActiveUser(redisClient, data.friend_id));
          return data;
      });

      Promise.all(friendList).then((result)=>{
          io.sockets.connected[socket.client.id].emit('getFriendList', result);
      });
    });*/
  })
});

const indexRouter = require('./api/index');
require('dotenv').config();


app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(cookieParser());
app.use(express.json());

// init websockets servers
const wssShareDB = require('./src/wss-sharedb')(server);
const wssCursors = require('./src/wss-cursors')(server);

//api router
app.use('/', indexRouter);

//mysql
mysql_db.sequelize.sync();

server.on('upgrade', (request, socket, head) => {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/sharedb') {
    wssShareDB.handleUpgrade(request, socket, head, (ws) => {
      wssShareDB.emit('connection', ws);
    });
  } else if (pathname === '/cursors') {
    wssCursors.handleUpgrade(request, socket, head, (ws) => {
      wssCursors.emit('connection', ws);
    });
  } else {
    socket.destroy();
  }
});

server.listen(4000, () =>
  console.log('Express server is running on localhost:4000')
);

