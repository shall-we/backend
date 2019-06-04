const UserAPI = require("./user");
const FolderAPI = require("./folder");
const NoteAPI = require("./note");
const NoticeAPI = require("./notice");

let router = require("express").Router();

// User
router.post("/join", UserAPI.register);
router.post("/login", UserAPI.login);
router.get("/user", UserAPI.getUserList);
router.get("/admin/user", UserAPI.getAllUserList);

// Folder
router.post("/folder", FolderAPI.register);
router.post("/folder/shared", FolderAPI.share);
router.delete("/folder/shared/:folder_id/:user_id", FolderAPI.unshare);
router.get("/folder/shared", FolderAPI.getSharedList);
router.get("/folder/private", FolderAPI.getPrivateList);
router.delete("/folder/:id", FolderAPI.delete);
router.patch("/folder/:id/:name", FolderAPI.updateFolderName);

// Note
router.get("/note/list", NoteAPI.getNoteList);
router.post("/note", NoteAPI.register);
router.patch("/note/:id/:name", NoteAPI.updateNoteName);
router.patch("/note/status/:id/:status", NoteAPI.setStatus);
router.get("/admin/note", NoteAPI.getNoteCount);

// Notice
router.get("/admin/notice", NoticeAPI.getNoticeList);
router.post("/admin/notice", NoticeAPI.register);
router.get("/admin/notice/:id", NoticeAPI.getNotice);
router.patch("/admin/notice/:id", NoticeAPI.updateNotice);
router.delete("/admin/notice/:id", NoticeAPI.deleteNotice);

module.exports = router;
