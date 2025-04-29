import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";

const prompt = Prompt({
  weight: "500",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "บัญชีของ sang-sung",
  description: "Budget Tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${prompt.className} antialiased`}>{children}</body>
    </html>
  );
}
