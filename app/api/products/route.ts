import { connectToDatabase } from "@/db/connectToDatabase";
import Product, { IProduct } from "@/models/Product.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../auth/[...nextauth]/authOptions";

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

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "Admin") {
      return NextResponse.json({ error: "🚫 Unauthorized! Admin access required." }, { status: 401 });
    }

    await connectToDatabase();
    const body: IProduct = await request.json();

    if (!body.name || !body.imageUrl ||  !body.imageFieldId ||!body.variants || body.variants.length === 0) {
      return NextResponse.json(
        { error: "⚠️ Missing required fields! Please provide product name, image URL, and at least one variant." },
        { status: 400 }
      );
    }

    for (const variant of body.variants) {
      if (!variant.type || !variant.price || !variant.license) {
        return NextResponse.json(
          { error: "⚠️ Invalid variant data! Each variant must have a type, price, and license." },
          { status: 400 }
        );
      }
    }

    const newProduct = await Product.create(body);
    return NextResponse.json({
      message: "✅ Product created successfully!",
      product: newProduct,
    });
  } catch (error) {
    console.error("❌ Error creating product:", error);
    return NextResponse.json(
      { error: "⚠️ Oops! Failed to create product. Please check the data and try again." },
      { status: 500 }
    );
  }
}