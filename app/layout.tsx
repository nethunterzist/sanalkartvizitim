import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "./components/AuthProvider";
import './lib/initDb';

export const metadata: Metadata = {
  title: "Sanal Kartvizit Sistemi",
  description: "Firmanızın sanal kartvizitleri",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Sanal Kartvizit Sistemi" />
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
