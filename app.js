const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const cookieParser = require('cookie-parser');
const mysql_db = require('./models/index');

const app = express();
const indexRouter = require('./api/index');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(express.json());

//api router
app.use('/', indexRouter);

//mysql
mysql_db.sequelize.sync();

app.listen(4000, () =>
  console.log('Express server is running on localhost:4000')
);
