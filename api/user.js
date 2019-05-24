let User = require('../models').user;
let authToken = require('../lib/token');

searchOne = data => {
  return User.findOne(data)
    .catch(err => {
      console.log("findOne err : " + err);
    });
};

exports.getUserList = async (req, res, next) => {
 var query = 'select a.id, a.name, (select permission from folder_list where folder_id=:id and user_id=a.id ) as isShared  from user a';
    var values = {
      id: req.query.folder_id
    };
    User.sequelize.query(query, {replacements: values})
    .spread(function (results, metadata) {
       
        res.send({
            result: "success",
            data: results
        });
      }, function (err) {
  
  
      });
};


// 회원가입
// application/json
// name, email, password, profile
exports.register = async (req, res, next) => {

  console.log('join');

  const { name, email, password, profile } = req.body;

  let result = await searchOne({
    where: {
      name: name,
      email: email,
    }
  });

  // auth_already_exists check
  if (result) {
    res.send({
      result: "fail",
      failType: "auth_already_exists"
    });
    return;
  }

  // insert query
  User.create({
    name: name,
    email: email,
    password: password,
    profile: profile,
  })
    .then(result => {
      res.send({
        result: "success"
      });
    })
    .catch(err => {
      console.log("[JOIN] create err : " + err);
    });
};

// 로그인
// application/json
// email, password
exports.login = async (req, res, next) => {
  console.log("login");

  let fail = null;

  let result = await searchOne({
    where: {
      email: req.body.email,
    }
  });

  // auth_not_exist check
  if (!result) fail = "auth_not_exist";

  // password_mismatch check
  if (result && result.dataValues.password !== req.body.password)
    fail = "password_mismatch";

  if (fail !== null) {
    res.send({
      result: "fail",
      failType: fail
    });

    return;
  }

  authToken.createToken({
    _id: result.dataValues.id,
    email: result.dataValues.email,
  }).then((token) => {

    res.send({
      result: "success",
      token: token,
      data: {
        id: result.dataValues.id,
        name: result.dataValues.name,
        profile: result.dataValues.profile
      }
    });

  }).catch((err) => {
    console.log('createToken error : ' + err);
  });
};
