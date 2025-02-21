import { connectToDatabase } from "@/db/connectToDatabase";
import User from "@/models/User.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();
        if (!email || !password) {
            return NextResponse.json({ error: "❌Both email and password are required!!!😵" }, { status: 400 });
        }
        await connectToDatabase();
    
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "❌You have already registered before using this email!!!😠" }, { status: 400 });
        }
    
        await User.create({ email, password });
        return NextResponse.json({ "message": "✅You have registered successfull😘!!!" }, { status: 201 });
        
    } catch (error) {
        console.error("❌Sorry we could not register you!!!");
        return NextResponse.json({ error: `❌Sorry we could not register you!!! ${error}` }, { status: 500 });
    }
}