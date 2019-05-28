const FriendList = require('../models').friend_list;
const User = require('../models').user;

exports.insertFriend = data => {
    return FriendList.create({user_id : data.user_id, friend_id : data.friend_id})
        .catch(err => console.log("삽입 중 에러 발생", err));
};

exports.deleteFriend = data => {
    return FriendList.destroy({where : {user_id : data.user_id, friend_id : data.friend_id}})
        .catch(err => console.log("삭제 중 에러 발생", err));
};

/*exports.searchFriend = data => {
    return FriendList.findOne({user_id : data.user_id})
        .catch(err => console.log("친구 조회 중 에러 발생", err));
};*/

exports.searchAllFriend = data => {
    return FriendList.findAll({attributes: ['friend_id'], where : {user_id : data.user_id}})
        .catch(err => console.log("친구 조회 중 에러 발생", err));
};

exports.searchAllFriendByOptions = data => {
    return FriendList.findAll(data)
        .catch(err => console.log("친구 조회 중 에러 발생", err));
};

exports.searchAllFriendByRawQuery = (queryStr, parameters) => {
    return FriendList.sequelize.query(queryStr,{replacements : parameters})
        .catch(err => console.log("친구 조회 중 에러 발생", err));
};





