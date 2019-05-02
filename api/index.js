const UserAPI = require('./user');
const FolderAPI = require('./folder');

let router = require('express').Router();

//user
router.post('/join', UserAPI.register);
router.post('/login', UserAPI.login);

router.post('/folder', FolderAPI.register);

module.exports = router;