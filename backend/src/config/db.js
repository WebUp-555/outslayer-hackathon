import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

export const connectDB = async()=>{try{
        const mongodbUri = process.env.MONGODB_URI?.trim();

        if (!mongodbUri || (!mongodbUri.startsWith("mongodb://") && !mongodbUri.startsWith("mongodb+srv://"))) {
            throw new Error("MONGODB_URI is missing or invalid. It must start with mongodb:// or mongodb+srv://");
        }

        const connectionUri = mongodbUri.endsWith("/") ? `${mongodbUri}${DB_NAME}` : `${mongodbUri}/${DB_NAME}`;
        const connectionInstance=await mongoose.connect(connectionUri)
           console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host} `);
    }catch(error){
        console.log("MONGODB CONNECTION FAILED", error);
        process.exit(1);
    }
}

export default connectDB