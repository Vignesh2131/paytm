const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken")
const User = require("../schemas/userSchema");
const { JWT_SECRET } = require("../config");
const router = express.Router();

//zod validation
const signUpBody = z.object({
    userName: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    password:z.string(),
})

const signInBody = z.object({
    email: z.string().email(),
    password:z.string()
})

router.post("/signup", async (req, res) => {
    const { success } = signUpBody.safeParse(req.body);

    if (!success) return res.status(411).json({
        message:"Email already taken"
    })

    const { userName, firstName, lastName, email, password } = req.body;

    const response = await User.findOne({ email: email });
    if (response)
        return res.status(411).json({ message: "Email already taken / Incorrect Inputs" })
    
    const user = await User.create({ userName, firstName, lastName, email, password });
    if (!user)
        return res.status(401).json({ message: "Missing inputs" });

    const id = user._id;

    const token = jwt.sign({ id }, JWT_SECRET);

    res.status(200).json({ message: "user created", token:token})
})

router.post("/signin", async (req, res) => {
    const { success } = signInBody.safeParse(req.body);
    if (!success) return res.status(411).json({ message: "Invalid inputs" });

    const user = await User.find({ email: req.body.email });
    if (!user) return res.status(401).json({ message: "No User found. Try to Sign up" })
    
    const id = user._id;
    const token = jwt.sign({ id }, JWT_SECRET);

    return res.status(200).json({token:token})
})

module.exports = router;
