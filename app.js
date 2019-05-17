const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const cookieParser = require('cookie-parser');
const mysql_db = require('./models/index');
const url = require('url');


const app = express();
const server = require('http').Server(app);


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
