import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User{
        role: string;
        id: string | mongoose.Types.ObjectId;
    }
    
    interface Session{
        user: {
            role: string;
            id: string| mongoose.Types.ObjectId;
        } & DefaultSession["user"];
    }

    interface user{
        role: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT{
        role: string;
        id: string| mongoose.Types.ObjectId;
    }
}