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

searchAll = data => {
    return Folder_List.findAll(data).catch(err => {
        console.log("findAll err : " + err);
    });
};


exports.getList = async (req, res, next) => {
    // Define the target key and the foreign key both in a relation
    Folder_List.belongsTo(Folder, { targetKey: "id", foreignKey: "folder_id" });

    let result = await searchAll({
        where: {
            user_id: parseInt(req.query.user_id)
        },
        include: [
            {
                model: Folder
            }
        ]
    });
    if (!result) {
        res.send({
            result: "error"
        });
        return;
    }
    
    res.send({
        result: "success",
        data: result
    });

};
exports.getPrivateList = async (req, res, next) => {
    var query = 'select name, permission from FOLDER_LIST,FOLDER where folder_id =id and folder_id IN(select folder_id as p_id  from FOLDER_LIST  group by folder_id having count(folder_id)< 2) and user_id=:id';
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
exports.getSharedList = async (req, res, next) => {
    var query = 'select name, permission from FOLDER_LIST,FOLDER where folder_id =id  and user_id=:id and  folder_id IN(select folder_id as p_id  from FOLDER_LIST  group by folder_id having count(folder_id)>1)';
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
