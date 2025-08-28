const express = require("express")
const userRouter = require("./routers/userRoute")
const authRouter = require("./routers/authRoute")
const productRouter = require("./routers/productRoute")
const logOutRouter = require("./routers/logOutRoute")
const cartRouter = require("./routers/cartRoute")
const uploadFileRouter = require("./routers/uploadFileRoute")
const otpRouter = require("./routers/otpRoute")
const connectDb = require("./dbconnect/mongodb")
require("dotenv").config()
const cookieParser = require("cookie-parser")


connectDb()
const app = express()


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", userRouter)
app.use("/api", authRouter)
app.use("/api", logOutRouter)
app.use("/api", productRouter)
app.use("/api", cartRouter)
app.use("/api", uploadFileRouter)
app.use("/api", otpRouter)


const port = process.env.PORT


app.listen(port, ()=> {
    console.log(`Server is listening on port ${port}`);
})
