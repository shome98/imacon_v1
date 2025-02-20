import mongoose, { model, models, Schema } from "mongoose";
import bcrypt from "bcryptjs";
export interface IUser{
    name?: {
        firstName: string;
        lastName?: string;
    },
    email: string;
    password: string;
    _id: mongoose.Types.ObjectId;
    isVerified?: boolean;
    role: "User" | "Admin";
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>({
    email:{type:String,required:true},
    password:{type:String,required:true,select:false},
    role: { type: String, required: true, enum: ["User", "Admin"], default: "User" }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});
userSchema.methods.isPasswordCorrect=async function(password:string):Promise<boolean>{
    return await bcrypt.compare(password,this.password);
};
const User = models?.User || model<IUser>("User", userSchema);
export default User;