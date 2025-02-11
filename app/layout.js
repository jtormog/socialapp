import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./ui/navbar";
import { auth0 } from "./lib/auth0";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({ children }) {
  const session = await auth0.getSession();

  if (!session) {
    return (
      <html>
        <body>
          <a href="/auth/login">Login</a>
        </body>
      </html>
    )
  }
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <a href="/auth/logout">Logout</a>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
