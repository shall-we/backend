const assert = require("assert");
const friend = require('../api/friend');

describe('friend test...', () => {

        it('test insert', ()=>{
            const data = {user_id : 3, friend_id : 4};
            assert(friend.insertFriend(data));
        });

/*
        it('test select friend', ()=>{
            const data = {user_id : 2};
            const result = friend.searchAllFriend(data);
            result.then((value)=>{
                assert(value);
                value.forEach((el)=>{
                    console.log(el.dataValues);
                });
             });
        });


        it('test delete friend', ()=>{
            const data = {user_id : 2, friend_id : 3};
            assert(friend.deleteFriend(data));
        });*/

});





