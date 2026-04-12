const router = require("express").Router();
const {
  transferFunds,
  getTransferHistory,
} = require("../controllers/transferCon");
const authorization = require("../middleware/authorization");

router.post("/send/:id", authorization, transferFunds);
router.get("/history/:id", authorization, getTransferHistory);

module.exports = router;
