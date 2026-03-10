import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/auth-provider";
import { CartProvider } from "@/components/cart-provider";

export const metadata: Metadata = {
  title: "Mehar Pardha | Modest Fashion Boutique",
  description: "Pink boutique ecommerce experience for abayas, pardha, hijab, shawl, and modest dresses with customer accounts and admin dashboard.",
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          <CartProvider>{children}</CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
