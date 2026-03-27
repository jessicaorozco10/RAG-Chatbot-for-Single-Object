import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harry Clarke Art Assistant",
  description: "Interactive Harry Clarke art assistant experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
