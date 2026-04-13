const express = require("express");
const controller = require("../controllers/carController");

const router = express.Router();

router.get("/", controller.getCars);
router.post("/", controller.createCar);
router.put("/:id", controller.updateCar);
router.delete("/:id", controller.deleteCar);

module.exports = router;
