const router = require("express").Router()
const { getAllHistory, depositHistory,  investHistory } = require("../controllers/historyCon")




router.get("/getallhistory", getAllHistory)
router.get("/deposithistory", depositHistory)
router.get("/investmenthistory", investHistory)


module.exports = router