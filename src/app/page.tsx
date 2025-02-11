"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">
          Bienvenido a <span className="highlight">CookBook Online</span>
        </h1>
        <p className="subtitle">
          Descubre, comparte y gestiona recetas en un solo lugar.
        </p>
      </header>
      <main className="main">
        <Image
          src="/images/super-chef-fork-spatula-chef-hero-mascot-vector-illustration-mascot-logo-image-super-chef-fork-spatula-chef-hero-197636829.webp"
          alt="Hero de CookBook Online"
          width={400}
          height={200}
          className="heroImage"
          priority
        />
        <div className="containerBusquedas">
          <h2 className="tituloBusquedas">Explora nuevas recetas</h2>
          <p className="sectionSubtitulos">
            Encuentra platos principales, postres, recetas veganas y más.
          </p>
          <div className="buttonsHome">
            <Link href="/explorerRecipes" className="buttonExplorarRecetas">
              Explorar Recetas
            </Link>
            {!user ? (
              <>
                <Link href="/login" className="buttonLogin">
                  Iniciar Sesión
                </Link>
                <Link href="/register" className="buttonLogin">
                  Registrarse
                </Link>
              </>
            ) : (
              <>
                <Link href="/recipes" className="buttonExplorarRecetas">
                  Añadir Receta
                </Link>
                <Link href="/misRecetas" className="buttonLogin">
                  Mis Recetas
                </Link>
                <Link href="/likedRecipes" className="buttonLogin">
                  Recetas Guardadas
                </Link>
                <button onClick={handleSignOut} className="buttonLogin">
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        </div>
        <section className="features">
          <div className="feature">
            <Image src="/images/favorito.png" alt="Favoritos" width={40} height={40} />
            <div>
              <h3 className="featureTitulo">Recetas Favoritas</h3>
              <p className="featureDescripcion">
                Guarda tus recetas favoritas para verlas fácilmente.
              </p>
            </div>
          </div>
          <div className="feature">
            <Image src="/images/compartir.png" alt="Compartir" width={40} height={40} />
            <div>
              <h3 className="featureTitulo">Comparte tus Recetas</h3>
              <p className="featureDescripcion">
                Sube y comparte tu creatividad culinaria.
              </p>
            </div>
          </div>
          <div className="feature">
            <Image src="/images/comentario.png" alt="Comunidad" width={40} height={40} />
            <div>
              <h3 className="featureTitulo">Comunidad Activa</h3>
              <p className="featureDescripcion">
                Interactúa con otros usuarios y descubre nuevas recetas.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}