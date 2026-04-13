const express = require("express");
const controller = require("../controllers/paymentController");

const router = express.Router();

router.get("/", controller.getPayments);
router.post("/", controller.createPayment);
router.put("/:id", controller.updatePayment);
router.delete("/:id", controller.deletePayment);

module.exports = router;
