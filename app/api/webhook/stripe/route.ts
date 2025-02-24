import { connectToDatabase } from "@/db/connectToDatabase";
import Order from "@/models/Order.model";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import nodemailer from "nodemailer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        const signature = req.headers.get("stripe-signature");
        const event = stripe.webhooks.constructEvent(body, signature!, process.env.STRIPE_WEBHOOK_SECRET!);

        await connectToDatabase();

        if (event.type == "checkout.session.completed") {
            const session = event.data.object;
            const order = await Order.findOneAndUpdate(
                { stripeSessionId: session.id },
                {
                    paymentIntentId: session.payment_intent,
                    status: "completed",
                }
            ).populate([{ path: "userId", select: "email" }, { path: "productId", select: "name" }]);

            if (order) {
                const transporter = nodemailer.createTransport({
                    host: "sandbox.smtp.mailtrap.io",
                    port: 2525,
                    auth: {
                        user: process.env.MAILTRAP_USER,
                        pass: process.env.MAILTRAP_PASS,
                    },
                });

                await transporter.sendMail({
                    from: '"ImaCon" <noreply@imaConshop.com>',
                    to: order.userId.email,
                    subject: "Payment Confirmation - ImaCon",
                    text: `
                            Thank you for your purchase!

                            Order Details:
                            - Order ID: ${order._id.toString().slice(-6)}
                            - Product: ${order.productId.name}
                            - Version: ${order.variant.type}
                            - License: ${order.variant.license}
                            - Price: $${order.amount.toFixed(2)}

                            Your image is now available in your orders page.
                            Thank you for shopping with ImaCon!
                        `.trim(),
                });
      }
    }

    return NextResponse.json({ received: true });
 
    } catch (error) {
        console.error("❌Webhook error ", error);
                return NextResponse.json({ error: "😵Webhook failed" }, { status: 500 });
    }
}