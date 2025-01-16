import type { Metadata } from "next";
import "./globals.css";



 export const metadata: Metadata = {
  title: "CookBook",
  description: "Pagina online donde subir tus recetas y consultar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
