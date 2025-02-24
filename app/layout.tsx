import type { Metadata } from "next";
import { Montserrat, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Provider from "./components/Provider";
import Header from "./components/Header";

// Load Montserrat font
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

// Load Nunito Sans font
const nunitoSans = Nunito_Sans({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ImaCon",
  description: "Site to buy images by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} ${nunitoSans.variable} antialiased`}
      >
        <Provider>
          <Header />
          <main className="container mx-auto px-4 py-8">{children}</main>
        </Provider>
      </body>
    </html>
  );
}