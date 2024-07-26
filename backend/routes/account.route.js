const express = require("express");
const router = express.Router();
const Account = require("../schemas/accountSchema")
const authMiddleware = require("../middlewares/auth.middleware")
router.get("/balance",authMiddleware, async (req, res) => {
    const account = Account.findOne({ userId: req.userId });
    res.json({
        balance: account.balance
    })
})
module.exports = router