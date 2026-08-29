import mongoose from "mongoose";


const connectToDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected successfully ${conn.connection.host}`);
    } catch (err) {
        console.log(`MongoDB connection error -> ${err}`)
    }

}

export default connectToDB