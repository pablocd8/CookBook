import Image from "next/image";
import Link from "next/link";
import Register from "./login/page";

export default function Home() {
  return (
    <div className="container">
      <header className="header">
        <h1 className="title">
          Bienvenido a <span className="highlight">CookBook Online</span>
        </h1>
        <p className="subtitle">
          Descubre, comparte y gestiona recetas de cocina en un solo lugar.
        </p>
      </header>
      <main className="main">
        <Image
          src="/images/super-chef-fork-spatula-chef-hero-mascot-vector-illustration-mascot-logo-image-super-chef-fork-spatula-chef-hero-197636829.webp"
          alt="Hero de CookBook Online"
          width={400}
          height={200}
          className="heroImage"
        />

   
        <div className="containerBusquedas">
          <h2 className="tituloBusquedas">Explora nuevas recetas</h2>
          <p className="sectionSubtitulos">
            Encuentra platos principales, postres, recetas veganas y mucho más.
          </p>
          <div className="buttonsHome">
            <a href="" className="buttonExplorarRecetas">
              Explorar Recetas
            </a>
            <Link href="/login" className="buttonLogin">
            Registrarse
            </Link>
          </div>
        </div>

    
        <section className="features">
          <div className="feature">
          <Image
            src="/images/simbolo-de-la-interfaz-de-busqueda.png" 
            alt="Recetas favoritas"
            width={40}
            height={40}
          />
            <div>
              <h3 className="featureTitulo">Búsqueda Avanzada</h3>
              <p className="featureDescripcion">
                Filtra recetas por ingredientes, tiempo de preparación o
                dificultad.
              </p>
            </div>
          </div>
          <div className="feature">
            <Image
              src="/images/favorito.png"
              alt="Recetas favoritas"
              width={40}
              height={40}
            />
            <div>
              <h3 className="featureTitulo">Recetas Favoritas</h3>
              <p className="featureDescripcion">
                Guarda tus recetas favoritas y accede a ellas fácilmente.
              </p>
            </div>
          </div>
          <div className="feature">
            <Image
              src="/images/compartir.png"
              alt="Compartir recetas"
              width={40}
              height={40}
            />
            <div>
              <h3 className="featureTitulo">Comparte tus Recetas</h3>
              <p className="featureDescripcion">
                Sube tus propias recetas y comparte tu creatividad culinaria.
              </p>
            </div>
          </div>
          <div className="feature">
            <Image
              src="/images/comentario.png"
              alt="Comunidad de cocina"
              width={40}
              height={40}
            />
            <div>
              <h3 className="featureTitulo">Comunidad Activa</h3>
              <p className="featureDescripcion">
                Interactúa con otros usuarios dejando comentarios y valoraciones.
              </p>
            </div>
          </div>
        </section>
      </main>

    
      <footer className="footer">
        © 2025 CookBook Online. Todos los derechos reservados.
      </footer>
    </div>
  );
}
