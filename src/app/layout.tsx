import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });
const fontHeading = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
})

export const metadata: Metadata = {
  title: "不俍人",
  description: "角色搭配模拟器",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
        <body
            className={cn(
                'antialiased',
                fontHeading.variable,
                fontBody.variable,
                inter.className
            )}
        >
        {children}
        </body>
      </html>
  )
}