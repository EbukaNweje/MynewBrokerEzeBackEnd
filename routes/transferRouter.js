const router = require("express").Router();
const {
  transferFunds,
  getTransferHistory,
} = require("../controllers/transferCon");

router.post("/send/:id", transferFunds);
router.get("/history/:id", getTransferHistory);

module.exports = router;
