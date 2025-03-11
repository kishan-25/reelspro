import mongoose, {Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface User {
    email: string;
    password: string;
    _id?: mongoose.Types.ObjectId;
    createdAt?: Date;
    updatedAt?: Date;
}

// jo bhi properties schema me banani h phele unka ek interface banana pdega 

const userSchema = new Schema<User>(
    {
        email: { type: String, required:true, unique: true},
        password: { type:String, required: true},
    },
    {
        timestamps: true
    }
);

// pre hook taki database me save hone se phele kya krne h 

userSchema.pre("save", async function (next) {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

const User = models?.User || model<User>("User", userSchema); // edge : agr user ka model exist krte h to vo hi return kr do nhi to bana do 

export default User;