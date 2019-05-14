const UserAPI = require("./user");
const FolderAPI = require("./folder");

let router = require("express").Router();

// user
router.post("/join", UserAPI.register);
router.post("/login", UserAPI.login);

router.post("/folder", FolderAPI.register);
router.post("/folder/shared", FolderAPI.share);
router.get("/folder/shared", FolderAPI.getSharedList);
router.get("/folder/private", FolderAPI.getPrivateList);
router.get("/note/list", FolderAPI.getNoteList);
router.delete("/folder/:id", FolderAPI.delete);
router.patch("/folder/:id/:name", FolderAPI.modifyFolderName);
module.exports = router;
