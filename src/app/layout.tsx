import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "记 · Journal",
  description: "和纸手帐风格个人日记",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-paper antialiased">
        {children}
      </body>
    </html>
  );
}
