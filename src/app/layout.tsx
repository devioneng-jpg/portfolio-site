import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devion's AI Twin | Devion Tharpe",
  description:
    "An AI-powered developer portfolio. Chat with Devion's AI Twin to learn about Devion's work, projects, and skills.",
  openGraph: {
    title: "Devion's AI Twin | Devion Tharpe",
    description: "Chat with an AI that knows everything about Devion's work.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${mono.variable} dark h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
