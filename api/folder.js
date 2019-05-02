let Folder = require('../models').folder;
let Folder_List = require('../models').folder_list;

// 회원가입 
// application/json
// user_id, name

exports.register = async (req, res, next)=>{

    console.log('create Folder');

    //insert query
    const id= await Folder.create({
        name : req.body.name
    })
    .then(result =>{
      return result.dataValues.id;
    })
    .catch( err =>{
        console.log('[Folder] create err : '+ err);
    });


    Folder_List.create({
        user_id : parseInt(req.body.user_id),
        folder_id :parseInt(id),
        permission : 'OWNER',

    }).then(result =>{
        res.send({
            result : "success",
            data:result
         });
     }).catch( err =>{
          console.log('[Folder] create err : '+ err);
      });


};