const router = require("express").Router()


const { createPlan, getAllPlans, getPlanById, deletePlan } = require("../controllers/plansController")






router.post("/createplan", createPlan)
router.get("/getallplan", getAllPlans)
router.get("/getoneplan/:id", getPlanById)
router.delete("/dleteplan/:id", deletePlan)

module.exports = router