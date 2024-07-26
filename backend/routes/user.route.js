const express = require("express");
const z = require("zod");
const jwt = require("jsonwebtoken")
const User = require("../schemas/userSchema");
const authMiddleware = require("../middlewares/auth.middleware")
const { JWT_SECRET } = require("../config");
const Account = require("../schemas/accountSchema")
const router = express.Router();

//zod validation
const signUpBody = z.object({
    userName: z.string(),
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
  password: z.string(),
})

const signInBody = z.object({
    email: z.string().email(),
    password:z.string()
})
const updateBody = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

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

  const userId = user._id;
  

  await Account.create({
    userId,
    balance: 1 + Math.random() * 10000,
  });
  


    const token = jwt.sign({ userId }, JWT_SECRET);

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


router.put("/", authMiddleware, async (req, res) => {
    const { success } = updateBody.safeParse(req.body);
    if (!success) {
        res.status(411).json({
            message:"Error while updating information"
        })
    }
    await User.updateOne({ _id: req.userId }, req.body);
    res.json({
        message:"Updated successfully"
    })
})

router.get("/bulk", async (req, res) => {
    let filter = req.query.filter;
    const users = await User.find({
      $or: [
        {
          firstName: {
            $regex: filter,
          },
        },
        {
          lastName: {
            $regex: filter,
          },
        },
      ],
    });
    if (!users) {
        return res.status(401).json({
            message:"No friend found with the name"
        })
    }
    res.status(200).json({
      user: users.map((user) => ({
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        _id: user._id,
      })),
    });

})

module.exports = router;
