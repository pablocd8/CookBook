import Link from "next/link";

export default function Register() {
  return (
    <>
      <div className="divPadreForm">
        <form className="formLogin">
          <header>
            <h1>Regístrate</h1>
          </header>

          <div className="contenedorInput">
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Nombre completo"
              aria-label="Nombre completo"
              required
            />

            <label htmlFor="email">Correo Electrónico:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="ejemplo@correo.com"
              aria-label="Correo Electrónico"
              required
            />

            <label htmlFor="password">Contraseña:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Contraseña"
              aria-label="Contraseña"
              required
            />

            <label htmlFor="confirmPassword">Confirmar Contraseña:</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirmar Contraseña"
              aria-label="Confirmar Contraseña"
              required
            />
          </div>

          <input type="submit" value="Registrarse" />
          <div className="linkRegistro">
            <Link href="/login">
              ¿Ya tienes una cuenta? Inicia sesión aquí
            </Link>
          </div>
        </form>
      </div>

      <footer className="footer">
        © 2025 CookBook Online. Todos los derechos reservados.
      </footer>
    </>
  );
}
