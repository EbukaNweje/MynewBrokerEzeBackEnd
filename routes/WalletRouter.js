const router = require("express").Router()
const {CreateWallet, deleteWalletAddress, updateWalletAddress, getAllWalletAddress, getOneWalletAddress}  = require("../controllers/AddWallet")


router.post("/createWalletAddress", CreateWallet)
router.get("/getallWalletAddress",  getAllWalletAddress)
router.delete("/deleteWalletAddress/:id", deleteWalletAddress)
router.patch("/updateWalletAdddrss", updateWalletAddress)
router.get("/getoneWalletAddress/:id", getOneWalletAddress)



module.exports = router
