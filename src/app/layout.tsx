import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import UserContextProvider from "./Context/ContextProvider";


export const metadata: Metadata = {
  title: "Medicite",
  description: "DraggingAndDropping Data testing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <UserContextProvider >
          {children}
        </UserContextProvider>
      </body>
    </html>
  );
}
