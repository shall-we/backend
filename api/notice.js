let Notice = require("../models").notice;
let newDate = require("date-utils");

// Get notification list
exports.getNoticeList = async (req, res, next) => {
  Notice.findAll({
    order: [[ "id", "DESC" ]]
  }).then(result => {
    res.send({
      result: "success",
      data: result
    })
  }).catch(err => {
    console.log("[ERROR] register : " + err);
  });
};

exports.register = async (req, res, next) => {
  const { title, content } = req.body;
  newDate = new Date();

  Notice.create({
    title: title,
    content: content,
    reg_date: newDate,
    start_date: newDate,
    end_date: newDate
  }).then(result => {
    res.send({
      result: "success",
      data: result
    })
  }).catch(err => {
    console.log("[ERROR] register : " + err);
  });
};

// Get notification
exports.getNotice = async (req, res, next) => {
  Notice.findOne({
    where: { id: req.params.id }
  })
  .then(result => {
    res.send({
      result: "success",
      data: result
    })
  }).catch(err => {
    console.log("[ERROR] getNotice : " + err);
  });
};

exports.updateNotice = async (req, res, next) => {
  Notice.update({
    title: req.body.title,
    content: req.body.content
  }, {
    where: { id: req.params.id }
  }).then(result =>  {
      res.send({
        result: "success",
        data: result
      })
  }).catch(err => {
      console.log("[ERROR] updateNotice: ", err);
  });
};

exports.deleteNotice = async (req, res, next) => {
  Notice.destroy({
    where: { id: req.params.id }
  }).then(result => {
    res.send({
      result: "success",
      data: result
    });
  }).catch(err => {
    console.log("[ERROR] deleteNotice: ", err);
  });
};
