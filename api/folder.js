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
    })
        .then(result => {
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

    console.log("node test22222::::", req.query.user_id);
    if (!result) {
        res.send({
            result: "error"
        });
        return;
    }
    console.log("node test::::", result);
    res.send({
        result: "success",
        data: result
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
