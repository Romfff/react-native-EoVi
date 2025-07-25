import express from "express"
import "dotenv/config"

import cors from "cors"

import authRoutes from"./routes/authRoutes.js";
import { connectDB } from "./lib/db.js"

import stRoutes from"./routes/stRoutes.js"



const app = express()

const PORT=process.env.PORT

app.use(express.json())

app.use("/api/auth",authRoutes)
app.use("api/st",stRoutes)

app.use(cors())

app.listen(PORT, () =>{
    console.log('Sever running on port on port',{PORT})
    connectDB()
})
