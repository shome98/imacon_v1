import { connectToDatabase } from "@/db/connectToDatabase";
import Product from "@/models/Product.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await props.params;
        await connectToDatabase();
        const product = await Product.findById(id).lean();
        if (!product) return NextResponse.json({ error: "😵 Product not found" }, { status: 404 });
        return NextResponse.json(product);
    } catch (error) {
        console.error(`🚫 Error fetching product ${error}`);
        return NextResponse.json({ error: "🚫 Failed to fetch product" }, { status: 500 });
    }
}

export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user?.role !== "Admin") {
            return NextResponse.json({ error: "🚫 Unauthorized! Admin access required." }, { status: 401 });
        }

        const { id } = await props.params;
        const body = await request.json();
        await connectToDatabase();

        const updatedProduct = await Product.findByIdAndUpdate(id, body, { new: true }).lean();
        if (!updatedProduct) {
            return NextResponse.json({ error: "😵 Product not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "✅ Product updated successfully!", product: updatedProduct });
    } catch (error) {
        console.error("❌ Error updating product:", error);
        return NextResponse.json({ error: "⚠️ Oops! Failed to update product. Please check the data and try again." }, { status: 500 });
    }
}