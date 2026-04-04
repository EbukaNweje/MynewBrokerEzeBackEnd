const router = require("express").Router();
const { getNotification } = require("../controllers/msgController");
const authorization = require("../middleware/authorization");

router.get("/getallnotification/:id", authorization, getNotification);

module.exports = router;
