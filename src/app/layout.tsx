import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import {cn} from "@/lib/utils";
import {useEffect} from "react";
import Script from "next/script";

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
  title: "冰与火之歌",
  description: "古魂经典服角色搭配模拟器V2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="zh">
        <body
            className={cn(
                'antialiased',
                fontHeading.variable,
                fontBody.variable,
                inter.className
            )}
        >
        {children}
        <Script
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=G-8WN21R19QV`}
        />
        <Script id="google-analytics" strategy="lazyOnload">
            {`            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-8WN21R19QV');
          `}
        </Script>
        </body>
      </html>
  )
}