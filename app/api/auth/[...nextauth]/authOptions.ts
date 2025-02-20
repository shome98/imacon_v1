import { connectToDatabase } from "@/db/connectToDatabase";
import User from "@/models/User.model";
import { NextAuthOptions} from "next-auth";
import  CredentialsProvider  from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password:{label:"Password",type:"password"}
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Missing email or password!!!😵");
                }
                try {
                    await connectToDatabase();
                    const user = await User.findOne({ email: credentials.email }).select("+password");
                    if (!user) throw new Error("No user found with this email!!!😢");
                    const isValid = user.isPasswordCorrect(credentials.password);
                    if (!isValid) throw new Error("Password is incorrect!!!😵");
                    return {
                        id: user._id.toString(),
                        email: user.email,
                        role: user.role
                    };
                } catch (error) {
                    console.error("Authentication error: ", error)
                    throw error;
                }
            },
        }),
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET!
        }),
    ],
    callbacks: {
        async signIn({user }):Promise<string|boolean> {
            try {
                await connectToDatabase();
                const existingUser = await User.findOne({ email: user.email });
                if (!existingUser) {
                    const newUser = await User.create({ email: user.email, password: "o auth provider" });
                    user.id = newUser._id?.toString();
                    user.role = newUser.role;
                    return true;
                }
                user.id = existingUser._id?.toString();
                user.role = existingUser.role;
                return true;
            } catch (error) {
                console.error("O auth login error: ", error);
                throw error;
            }
        },
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
                token.id=user.id
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.role = token.role as string;
                session.user.id = token.id as string;
            }
            return session;
        }
    },
    pages: {
        signIn: "/login",
        error:"/login"
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    secret:process.env.NEXTAUTH_SECRET
}