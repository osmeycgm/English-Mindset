// src/Components/Home/Header/Header.jsx
export const Header = () => {
  return (
    <>
      <header 
        className="header header-fit" 
        style={{
          position: "relative",
          minHeight: "70vh", // Asegura un buen tamaño en pantalla
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      > 
        {/* Este es el Overlay moderno: oscurece toda la foto, no solo una burbuja */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.6)", // Ajusta el 0.6 para más o menos oscuridad
          zIndex: 1
        }}></div>

        {/* Contenido (Fuera de la burbuja, directamente sobre el overlay) */}
        <div style={{ 
            position: "relative", 
            zIndex: 2, 
            textAlign: "center",
            padding: "0 20px" 
        }}>
          
          {/* LOGO EN EL HEADER (Mismo estilo que navegación, un poco más grande) */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "15px" }}>
            <span style={{
              fontSize: "5rem", // Más grande para el Hero
              fontWeight: "900",
              color: "#85084d",
              fontFamily: "Georgia, serif",
              letterSpacing: "-2px",
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)" // Sombre para que no se pierda
            }}>CLAUD</span>
            <div style={{ display: "flex", flexDirection: "column", lineHeight: "1", paddingTop: "15px" }}>
              {/* Puse la palabra FIT en blanco para que contraste mejor con el fondo oscuro */}
              <span style={{ fontSize: "22px", fontWeight: "700", color: "#ffffff", letterSpacing: "3px" }}>FIT</span>
            </div>
          </div>

          <h4 className="text-white fw-light mb-3" style={{ letterSpacing: "1px" }}>
            Acompañamiento Personalizado Profesional
          </h4>
          <p className="lead text-white-50 mb-4">Empodera tu cuerpo, dirige tu vida.</p>
          
          <div className="d-flex gap-3 justify-content-center mt-4">
             <button 
                className="btn btn-outline-light btn-lg px-5 py-2" 
                style={{ borderRadius: "30px", fontWeight: "600" }}>
               Clases
             </button>
          </div>
        </div>
      </header>
    </>
  )
}