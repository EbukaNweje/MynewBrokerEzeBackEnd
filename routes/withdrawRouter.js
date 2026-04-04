
const router = require("express").Router()

const { withdraw, getAllWithdrawal } = require("../controllers/withdrawCon")



router.post("/withdraw/:id", withdraw)
router.get("/allwithdrawal", getAllWithdrawal)


module.exports = router