"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";



export default function LoginForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
      }),
    });

    const data = await res.json();
    console.log(data);

    if (!res.ok) {
      setError(data.error || "Error en el inicio de sesión");
    } else {
      localStorage.setItem("user", JSON.stringify(data.user)); 
      router.push("/"); // Redirige a la página principal después del inicio de sesión
    }
  };

  return (

  <div className="divPadreForm">
      <form className="formLogin" onSubmit={handleSubmit}>
        <header>
          <h1>Iniciar Sesión</h1>
        </header>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="contenedorInput">
          <label htmlFor="email">Correo Electrónico:</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />

          <label htmlFor="password">Contraseña:</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>

        <input type="submit" value="Iniciar Sesión" />
        <div className="linkRegistro">
          <Link href="/register">¿No tienes una cuenta? Regístrate aquí</Link>
        </div>
      </form>
    </div>
  );
}
