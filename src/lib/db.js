import mongoose from "mongoose"

export const connectDB = async () =>
{
    try{
        const conn= await mongoose.connect(process.env.MONGO_URL)
        console.log('Data base connected',conn.connection.host)
    }
    catch(error)
    {
        console.log("Erro connecting to databae",error)
        process.exit(1)
    }
}