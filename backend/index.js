const express = require("express");
const connectDB = require("./db.js")
const app = express();
const cors = require('cors');
const publicRoute = require("./routes/index.js")
const User = require("./schemas/userSchema.js")

app.use(express.json());
app.use(cors());

connectDB();

app.use("/api/v1",publicRoute)

app.listen(4000, () => {
    console.log(`Listening to the port 4000`)
})

