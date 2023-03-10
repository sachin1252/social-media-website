const router = require("express").Router();
const PostsController = require("../Controllerss/postController");
const requireUser = require("../middlewaress/requireUsers");

//router.get("/all", requireUser, PostController.getAllPostController);
router.post("/", requireUser, PostsController.createPostController);
router.post("/like", requireUser, PostsController.likeAndUnlikePost);
router.put("/", requireUser, PostsController.updatePostController);
router.delete("/", requireUser, PostsController.deletePost);
module.exports = router;
