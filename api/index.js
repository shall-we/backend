const UserAPI = require("./user");
const FolderAPI = require("./folder");

let router = require("express").Router();

// user
router.post("/join", UserAPI.register);
router.post("/login", UserAPI.login);

router.post("/folder", FolderAPI.register);
router.get("/folder/shared", FolderAPI.getList);
router.get("/folder/private", FolderAPI.getList);

module.exports = router;
