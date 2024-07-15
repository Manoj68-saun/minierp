const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/checkStatus", authController.isLoggedIn);
router.get("/finYearModule", authController.finYearModule);
router.get("/companyModule", authController.companyModule);
router.get("/getUserType", authController.getUserType);

router.patch(
  "/changePassword",
  authController.protect,
  authController.updateMyPassword
);

module.exports = router;
