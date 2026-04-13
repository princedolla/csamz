const express = require("express");
const controller = require("../controllers/authController");
const { requireAuth, requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", requireAuth, requireRole("admin"), controller.register);
router.post("/login", controller.login);
router.post("/logout", requireAuth, controller.logout);
router.get("/me", requireAuth, controller.me);

module.exports = router;
