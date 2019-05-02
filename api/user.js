let User = require('../models').user;

//jwt token
// let jwt = require("jsonwebtoken");
// const env = process.env.NODE_ENV || 'development';
// const jwt_conf = require(__dirname + '/../config/jwt.json')[env];
// require('dotenv').config();

searchOne = data => {


  return User.findOne(data)
    .catch(err => {
      console.log("findOne err : " + err);
    });
};

searchAll = data => {
  return User.findAll(data)
    .catch(err => {
      console.log("findAll err : " + err);
    });
};

// 회원가입 
// application/json
// name, email, password, profile

exports.register = async (req, res, next) => {

  console.log('join');

  // auth_already_exists check
  let result = await searchOne({
    where: {
      name: req.body.name,
      email: req.body.email,
    }
  });

  if (result) {
    res.send({
      result: "fail",
      failType: "auth_already_exists"
    });
    return;
  }

  // insert query
  User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    profile: req.body.profile,
  })
    .then(result => {
      res.send({
        result: "success"
      });
    })
    .catch(err => {
      console.log('[JOIN] create err : ' + err);
    });

};

// 로그인
// application/json
// email, password
exports.login = async (req, res, next) => {

  console.log('login');

  let fail = null;

  let result = await searchOne({
    where: {
      email: req.body.email,
    }
  });

  // auth_not_exist check
  if (!result)
    fail = "auth_not_exist";

  // password_mismatch check
  if (result && result.dataValues.password !== req.body.password)
    fail = "password_mismatch";

  if (fail !== null) {
    res.send({
      result: "fail",
      failType: fail,
    });

    return;
  }

  //console.log('jwt_conf', jwt_conf.secretKey);

  //login jwt
  // let tokens = jwt.sign({
  //   _id: result.dataValues.id,
  //   email: result.dataValues.email,

  // }, jwt_conf.secretKey,
  //   {
  //     expiresIn: "1h",

  //   }, (err, token) => {
  //     if (err) {
  //       console.log("jwt error : " + err);
  //       return;
  //     }

  //     console.log('tokens : ' + token);
  //     if(token)
  //     {
  //       res.cookie(
  //         "user" , token
  //       );
  //     res.send({
  //       result : "success",
  //       token : token
  //     });
  //     }
  //   });

  res.send({
    result : "success",
    data :{
      id : result.dataValues.id,
      name : result.dataValues.name,
      profile : result.dataValues.profile 
    }
  });

};
