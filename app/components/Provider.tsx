"use client"
import { ImageKitProvider } from "imagekitio-next";
import { SessionProvider } from "next-auth/react";
import { NotificationProvider } from "./NotificationPopup";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const urlEndpoint = process.env.NEXT_PUBLIC_URL_ENDPOINT!;
const publicKey = process.env.NEXT_PUBLIC_PUBLIC_KEY!;
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

export default function Provider({ children }: { children: React.ReactNode }) {
    const imagekitAuthenticator = async () => {
        try {
            const response = await fetch("/api/auth-imagekit");
            if (!response.ok) throw new Error("❌ Failed to autheniticate imagekit");
            return response.json();
        } catch (error) {
            console.error("😵 Imagekit authenication error: ", error);
            throw error;
        }
    }

    return (
        <Elements stripe={stripePromise}>
            <SessionProvider refetchInterval={5 * 60}>
            
                <NotificationProvider>
                    <ImageKitProvider publicKey={publicKey} urlEndpoint={urlEndpoint} authenticator={imagekitAuthenticator}>
                        {children}
                    </ImageKitProvider>
                </NotificationProvider>
            
            </SessionProvider>
        </Elements>
    );
}