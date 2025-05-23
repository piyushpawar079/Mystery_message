import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Mystery Message",
  description: "Generated by create next app",
};


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {


  return (
    // <html lang="en">
    //     <body
    //       className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    //       >
    //         <NavBar />
    //       {children}
    //     </body>
    // </html>
    <div>
        <NavBar />
        {children}
    </div>
  );
}
