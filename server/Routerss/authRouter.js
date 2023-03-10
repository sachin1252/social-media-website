 const router = require("express").Router();
 const authController = require("../Controllerss/authController");

 router.post("/signup", authController.signupController);
 router.post("/login", authController.loginController);
 router.get("/refresh", authController.refreshAccessTokenGenerator);
 router.post("/logout", authController.logoutController);
 module.exports = router;
