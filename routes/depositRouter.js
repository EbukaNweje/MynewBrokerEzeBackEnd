const { deposit, getAllDeposits } = require("../controllers/depositCon")

const router = require("express").Router()




router.post("/deposit/:id", deposit)
router.get("/alldeposit", getAllDeposits)


module.exports = router