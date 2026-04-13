const express = require("express");
const controller = require("../controllers/servicePackageController");

const router = express.Router();

router.get("/", controller.getServicePackages);
router.post("/", controller.createServicePackage);
router.put("/:id", controller.updateServicePackage);
router.delete("/:id", controller.deleteServicePackage);

module.exports = router;
