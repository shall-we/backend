const UserAPI = require('./user');

let router = require('express').Router();

//user
router.post('/join', UserAPI.register);
router.post('/login', UserAPI.login);
router.get('/logout', UserAPI.logout);

module.exports = router;