const mongoose = require("mongoose");

async function connectDB() {
    const res = await mongoose.connect(
      "mongodb+srv://vigneshsadhu:vignesh%4021@cluster0.vsfh4yr.mongodb.net/paytm?retryWrites=true&w=majority&appName=Cluster0"
    );
    if(res) console.log("DB Connected")
}

module.exports = connectDB