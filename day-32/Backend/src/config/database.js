import mongoose from "mongoose";


const connectToDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log(`MongoDB connected successfully`);
    } catch (err) {
        console.log(`MongoDB connection error -> ${err}`)
    }

}

export default connectToDB