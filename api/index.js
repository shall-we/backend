const UserAPI = require("./user");
const FolderAPI = require("./folder");
const NoteAPI = require("./note");

let router = require("express").Router();

// user
router.post("/join", UserAPI.register);
router.post("/login", UserAPI.login);

// folder
router.post("/folder", FolderAPI.register);
router.post("/folder/shared", FolderAPI.share);
router.get("/folder/shared", FolderAPI.getSharedList);
router.get("/folder/private", FolderAPI.getPrivateList);
router.delete("/folder/:id", FolderAPI.delete);
router.patch("/folder/:id/:name", FolderAPI.modifyFolderName);

// note
router.get("/note/list", NoteAPI.getNoteList);
router.post("/note",NoteAPI.register);

module.exports = router;
