const express = require("express");
const controller = require("../controllers/packageController");
const { requireRole } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", controller.getPackages);
router.post("/", requireRole("admin"), controller.createPackage);
router.put("/:id", requireRole("admin"), controller.updatePackage);
router.delete("/:id", requireRole("admin"), controller.deletePackage);

module.exports = router;
