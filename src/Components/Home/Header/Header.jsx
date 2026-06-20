// src/Components/Home/Header/Header.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// 💡 IMPORTAMOS EL ARRAY DESDE SERVICIOS
import { headerImages } from '../../../servicios';

export const Header = () => {
  const navigate = useNavigate();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Usamos headerImages directamente para calcular el siguiente índice
      setCurrentIndex((prevIndex) => (prevIndex + 1) % headerImages.length);
    }, 3200); 

    return () => clearInterval(interval);
  }, [headerImages.length]);

  const buttonStyle = {
    backgroundColor: isHovered ? "#1d4ed8" : "#1e3a8a", 
    color: "#fff", 
    borderRadius: "8px", 
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out", 
    transform: isActive 
      ? "scale(0.96)" 
      : isHovered 
        ? "scale(1.05)" 
        : "scale(1)", 
    boxShadow: isActive 
      ? "0 2px 6px rgba(30, 58, 138, 0.2)" 
      : isHovered 
        ? "0 8px 20px rgba(30, 58, 138, 0.35)" 
        : "0 4px 12px rgba(30, 58, 138, 0.25)"
  };

  return (
    <>
      <header 
        className="header header-academy" 
        style={{
          position: "relative",
          backgroundColor: "#f0f9ff", 
          height: "auto", 
          minHeight: "auto", 
          display: "flex",
          alignItems: "center",
          padding: "2.5rem 0 2rem 0", 
          overflow: "hidden"
        }}
      > 
        <div className="container">
          <div className="row align-items-center">
            
            {/* COLUMNA IZQUIERDA: TEXTO */}
            <div className="col-12 col-md-5 text-center text-md-start mb-3 mb-md-0">
              
              <span style={{
                backgroundColor: "#000000",
                color: "#ffffff",
                padding: "5px 14px",
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: "700",
                letterSpacing: "0.5px",
                display: "inline-block",
                marginBottom: "1rem"
              }}>
                Expande tus Capacidades con Métodos Reales 🚀
              </span>

              <h1 style={{
                fontSize: "2.8rem", 
                fontWeight: "800",
                color: "#1e3a8a", 
                lineHeight: "1.1", 
                fontFamily: "'Inter', sans-serif"
              }} className="mb-2">
                Piensa en inglés<br />
                <span style={{ color: "#0284c7", fontSize: "2.4rem" }}>Habla con el mundo.</span>
              </h1>

              <p className="lead mb-3" style={{ color: "#475569", fontSize: "1rem", fontWeight: "400" }}>
                Rompe de una vez la barrera de la traducción mental. Clases en vivo, grupos reducidos y un enfoque 100% en el desarrollo del Inglés como segunda lengua.
              </p>
              
              <div className="d-flex gap-3 justify-content-center justify-content-md-start flex-wrap">
                  <button 
                    className="btn btn-lg px-4 py-2.5" 
                    style={buttonStyle}
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => { setIsHovered(false); setIsActive(false); }}
                    onMouseDown={() => setIsActive(true)}
                    onMouseUp={() => setIsActive(false)}
                    onClick={() => navigate('/test')} 
                  >
                    Test de Nivel Gratis
                  </button>
              </div>
            </div>

            {/* COLUMNA DERECHA: CARRUSEL */}
            <div className="col-12 col-md-7 d-flex justify-content-center align-items-center position-relative mt-4 mt-md-0">
              <div style={{
                position: "absolute",
                width: "350px", 
                height: "350px", 
                backgroundColor: "#e0f2fe",
                borderRadius: "50%",
                filter: "blur(60px)", 
                zIndex: 1,
                top: "10%",
                opacity: 0.6
              }}></div>

              <div style={{
                position: "relative",
                width: "95%", 
                height: "auto",
                aspectRatio: "1.5 / 1", 
                zIndex: 2,
                boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                borderRadius: "16px",
                overflow: "hidden", 
              }}>
                {/* 💡 RECORREMOS EL ARRAY IMPORTADO */}
                {headerImages.map((src, index) => (
                  <img 
                    key={src} 
                    src={src} 
                    alt={`Estudiantes English Mindset Slide ${index + 1}`} 
                    className="img-fluid"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover", 
                      borderRadius: "16px",
                      transition: "opacity 1s ease-in-out", 
                      opacity: index === currentIndex ? 1 : 0,
                    }}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </header>
    </>
  );
};