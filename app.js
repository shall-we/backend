const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();

const sequelize = require('./models/index').sequelize;

const app = express();
const indexRouter = require('./api/index');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino);
app.use(express.json());


//api router
app.use('/', indexRouter);

//mysql
sequelize.sync();

app.listen(4000, () =>
  console.log('Express server is running on localhost:4000')
);
