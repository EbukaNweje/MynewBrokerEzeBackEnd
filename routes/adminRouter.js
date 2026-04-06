const router = require("express").Router();
const {
  confirmDeposit,
  confirmWithdraw,
  trunOnUserNotification,
  backdateWithdrawals,
  backdateDeposits,
} = require("../controllers/Admin");
const { AdminSendEmail } = require("../controllers/Contacts");

router.post("/confirm-deposit/:depositId", confirmDeposit);
router.post("/confirm-withdrawal/:withdrawId", confirmWithdraw);
router.post("/turn-on-user-notification/:userId", trunOnUserNotification);
router.post("/adminsendemail/:id", AdminSendEmail);
router.post("/backdate-withdrawals/:userId", backdateWithdrawals);
router.post("/backdate-deposits/:userId", backdateDeposits);

module.exports = router;
