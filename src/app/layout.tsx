import type { Metadata } from "next";
import "../app/styles/globals.css"; 


export const metadata: Metadata = {
  title: "CookBook",
  description: "Página online donde subir tus recetas y consultar",
};

export default function RootLayout({ children }: {children: React.ReactNode;}) {
  return (
    <html lang="en">
      <body>
        {children}
        <footer className="footer">
          © 2025 CookBook Online. Todos los derechos reservados.
        </footer>
      </body>
    </html>
  );
}
