let Folder = require("../models").folder;
let Folder_List = require("../models").folder_list;


// 회원가입
// application/json
// user_id, name
exports.register = async (req, res, next) => {
    console.log("create");

    //insert query
    const id = await Folder.create({
        name: req.body.name
    }).then(result => {
            return result.dataValues.id;
        })
        .catch(err => {
            console.log("[Folder] create err : " + err);
        });

    Folder_List.create({
        user_id: parseInt(req.body.user_id),
        folder_id: parseInt(id),
        permission: "OWNER"
    })
        .then(result => {
            res.send({
                result: "success",
                data: result
            });
        })
        .catch(err => {
            console.log("[Folder] create err : " + err);
        });
};

exports.getPrivateList = async (req, res, next) => {
    var query = 'select name, permission,folder_id from FOLDER_LIST,FOLDER where folder_id =id and folder_id IN(select folder_id as p_id  from FOLDER_LIST  group by folder_id having count(folder_id)< 2) and user_id=:id';
    var values = {
      id: req.query.user_id
    };
    Folder_List.sequelize.query(query, {replacements: values})
    .spread(function (results, metadata) {
        console.log('dddd',results);
        res.send({
            result: "success",
            data: results
        });
      }, function (err) {
  
  
      });
};

exports.delete=async (req, res, next) => {
    Folder.destroy({
        where: {id:req.params.id}
    })
    .then( result => {
        res.send({
            result: "success",
            data: result
        });
    })
    .catch( err => {
        console.log("데이터 삭제 실패");
    });
}

exports.getSharedList = async (req, res, next) => {
    var query = 'select name, permission,folder_id from FOLDER_LIST,FOLDER where folder_id =id  and user_id=:id and  folder_id IN(select folder_id as p_id  from FOLDER_LIST  group by folder_id having count(folder_id)>1)';
    var values = {
      id: req.query.user_id
    };
    Folder_List.sequelize.query(query, {replacements: values})
    .spread(function (results, metadata) {
       
        res.send({
            result: "success",
            data: results
        });
      }, function (err) {
  
  
      });
};

exports.share = async (req, res, next) => {
    Folder_List.create({
        user_id: parseInt(req.body.user_id),
        folder_id: parseInt(req.body.folder_id),
        permission: req.body.permission
    })
        .then(result => {
            res.send({
                result: "success",
                data: result
            });
        })
        .catch(err => {
            console.log("[Folder] share err : " + err);
        });
};

exports.modifyFolderName = async (req, res, next) => {
    console.log("test");
    Folder.update({name: req.params.name},
    {
        where: {id: req.params.id}, returning: true})
        .then(function(result) {
        res.json(result[1][0]);
    }).catch(function(err) {
        console.log("데이터 수정 실패");
    });
};