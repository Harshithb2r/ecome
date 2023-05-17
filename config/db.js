import mongoose from "mongoose";

const connectDB = async () =>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL)
        console.log("connect to db")
    } catch (error) {
        console.log("error in database")
    }
}

export default connectDB