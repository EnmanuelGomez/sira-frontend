import { useEffect } from "react";
import Image from "next/image";
import "./styles/homePage.css"; 
import Footer from "./components/Footer";

export default function HomePage() {

  useEffect(() => {
    // Ping al backend para "despertarlo"
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/ping`).catch(() => {});
  }, []);

  return (
    <div className="container">
      {/* Header */}
      <header className="header">
        <div className="logo">SIRA</div>
        <nav className="nav">
        <a href="/seguros" className="hover:underline">Buscar Seguros</a>
          <a href="/login">Login</a>
          <a className="register" href="/register">Regístrate</a>
        </nav>
      </header>

      {/* Main content */}
      <main className="main">
        <h1 className="title">
          Sistema Inteligente de Recomendación de Aseguramiento
        </h1>

        <div className="image-container">
          <Image
            src="/seguro-inteligente.png"
            alt="Recomendación de seguros"
            width={600}
            height={300}
          />
        </div>

        <p className="description">
          La plataforma <strong>SIRA</strong> busca facilitar la comparación y selección de seguros de salud, vida, viajes, 
          vehículo y hogar mediante un sistema de recomendación basado en inteligencia artificial. A través de una interfaz 
          intuitiva y modelos personalizados, se pretende empoderar a los usuarios con información clara y adaptada a sus 
          necesidades.
        </p>
      </main>

      <>
        <Footer />
      </>
    
    </div>
  );
}