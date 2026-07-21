import type { Metadata } from "next";
import "./globals.css";
import RouteChrome from "@/components/RouteChrome";
import TerminalToggle from "@/app/components/TerminalToggle";


export const metadata: Metadata = {
  title: "ISTE NITK",
  description: "A student chapter website for ISTE"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body>
        <RouteChrome>{children}</RouteChrome>
        <TerminalToggle />
      </body>
    </html>
  );
}

