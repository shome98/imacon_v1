import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/authOptions";
import { connectToDatabase } from "@/db/connectToDatabase";
import Stripe from "stripe";
import Order from "@/models/Order.model";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) return NextResponse.json({ erorr: "🚫Unauthorized" }, { status: 401 });
        
        const { productId, variant } = await req.json();
        await connectToDatabase();
        
        const stripeSession = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode:"payment",
            line_items: [
                {
                    price_data: {
                        currency: "INR",
                        product_data: {
                            name: productId.toString(),
                        },
                        unit_amount: Math.round(variant.price * 100),
                    },
                    quantity: 1,
                },
            ],
            success_url: `${process.env.NEXTAUTH_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.NEXTAUTH_URL}/cancel`,
        });

        const newOrder = await Order.create({
            userId: session.user.id,
            productId,
            variant,
            stripeSessionId: stripeSession.id,
            amount: variant.price,
            status: "pending",
        });

        return NextResponse.json({
            orderId: stripeSession.id,
            amount: stripeSession.amount_total,
            currency: stripeSession.currency,
            dbOrderId: newOrder._id,
        });
        
    } catch (error) {
        console.error("❌Error placing order: ", error);
        return NextResponse.json({ error: "😵Failed to place the order" }, { status: 500 });
    }
}