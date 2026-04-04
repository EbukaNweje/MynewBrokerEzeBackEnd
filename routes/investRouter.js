
const router = require("express").Router()

const { makeInvestment } = require("../controllers/investController")





router.post("/invest/:userId", makeInvestment)

module.exports = router