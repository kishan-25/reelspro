import mongoose from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

if(!MONGODB_URL) {
    throw new Error(
        "Plz define the MONGODB_URL environment variable inside .env.local"
    );
}

let cached = global.mongoose;

if(!cached) {
    cached = global.mongoose = { conn: null, promise: null};
}

export async function connectToDatabase() {
    if(cached.conn){ // connection h to conn return  kr do
        return cached.conn;
    }

    if(!cached.promise) { // agr promise nhi h
        const opts = {
            bufferCommands: true,
            maxPoolSize: 10,
        };

        cached.promise = mongoose
            .connect(MONGODB_URL, opts)
            .then(() => mongoose.connection);
    }

    try {
        cached.conn = await cached.promise;
    }catch(e) {
        cached.promise = null;
        throw e;
    }

    return catched.conn;
}