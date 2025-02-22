import { connectToDatabase } from "@/db/connectToDatabase";
import Product, { IProduct } from "@/models/Product.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({}).lean();

    if (!products || products.length === 0) {
      return NextResponse.json({ message: "😕 No products found!" }, { status: 200 });
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return NextResponse.json(
      { error: "⚠️ Oops! Something went wrong while fetching products. Please try again later." },
      { status: 500 }
    );
  }
}

