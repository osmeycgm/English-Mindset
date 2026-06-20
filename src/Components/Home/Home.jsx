import { useState, useEffect, useMemo, memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";

// IMPORTACIÓN ACTUALIZADA: Traemos homeClubs en lugar de clubs
import { servicios, testimonios, homeClubs } from "../../servicios"; 
import { CardServicio } from "./CardServicio/CardServicio";
import { Header } from "./Header/Header";
import { useCart } from "../Context/CartContext";

// ─── HOOK DE ANIMACIÓN ──────────────────────────────────────────────────────
const useFadeIn = (threshold = 0.1) => {
  const [ref, setRef] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); 
        }
      },
      { threshold }
    );
    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return { setRef, isVisible };
};

// ─── COMPONENTE SLIDER MEMOIZADO ────────────────────────────────────────────
const SectionSlider = memo(({ title, subtitle, items, onAdd }) => {
  const [index, setIndex] = useState(0);
  const VISIBLE = 2;
  const total = items.length;
  const { setRef, isVisible } = useFadeIn(0.2);

  const prev = useCallback(() => {
    setIndex(i => (i === 0 ? total - VISIBLE : i - 1));
  }, [total]);

  const next = useCallback(() => {
    setIndex(i => (i >= total - VISIBLE ? 0 : i + 1));
  }, [total]);

  const visibleItems = items.slice(index, index + VISIBLE);

  return (
    <section style={{ position: "relative", padding: "0 10px" }}>
      <div className="text-center mb-3">
        <h2 className="fw-bold text-uppercase m-0" style={{ letterSpacing: "1.5px", color: "#1e3a8a", fontSize: "1.8rem" }}>
          {title}
        </h2>
        <p className="text-muted small mb-2">{subtitle}</p>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button onClick={prev} style={arrowStyle} className="hover-jump-btn">
          <i className="bi bi-chevron-left" />
        </button>

        <div
          ref={setRef}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "20px",
            flex: 1,
            overflow: "hidden",
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(30px)",
            transition: "opacity 0.6s ease-out, transform 0.6s ease-out"
          }}
        >
          {visibleItems.map(item => (
            <CardServicio key={item.id} {...item} onAgregar={() => onAdd(item)} />
          ))}
        </div>

        <button onClick={next} style={arrowStyle} className="hover-jump-btn">
          <i className="bi bi-chevron-right" />
        </button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "12px" }}>
        {Array.from({ length: total - VISIBLE + 1 }).map((_, i) => (
          <span
            key={i}
            onClick={() => setIndex(i)}
            style={{
              width: "8px", height: "8px", borderRadius: "50%",
              backgroundColor: i === index ? "#1e3a8a" : "#ccc",
              cursor: "pointer", transition: "background 0.3s"
            }}
          />
        ))}
      </div>

      <div className="text-center mt-4">
        <Link
          to="/planes"
          className="btn btn-light px-4 py-2 fw-bold hover-jump-btn"
          style={{ 
            backgroundColor: "#1e3a8a",
            borderRadius: "50px", 
            fontSize: "1rem", 
            color: "#ffffff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.12)" 
          }}
        >
          Ver más planes <i className="bi bi-arrow-right ms-1" />
        </Link>
      </div>
    </section>
  );
});

// ─── COMPONENTE CONVERSATION CLUBS ──────────────────────────────────────────
const ConversationClubs = memo(({ onAdd }) => {
  const { setRef, isVisible } = useFadeIn(0.2);

  return (
    <section style={{ backgroundColor: "#f0f7ff", padding: "2.5rem 0", margin: "2.5rem 0" }}>
      <div className="container-fluid px-md-5">
        <div className="text-center mb-4">
          <span
            className="badge mb-2 text-uppercase fw-bold"
            style={{ backgroundColor: "rgba(2, 132, 199, 0.12)", color: "#0284c7", fontSize: "0.75rem", letterSpacing: "1.5px", padding: "8px 16px", borderRadius: "30px" }}
          >
            Experiencia Exclusiva
          </span>
          <h2 className="fw-bold text-uppercase m-0" style={{ letterSpacing: "2px", color: "#1e3a8a", fontSize: "2.2rem" }}>
            Clubes de Conversación
          </h2>
          <p className="text-muted mx-auto mt-2" style={{ maxWidth: "800px", fontSize: "1rem" }}>
            Lleva tu speaking al siguiente nivel con dinámicas diseñadas para mentes globales.
          </p>
        </div>

        <div
          ref={setRef}
          className="row g-4 justify-content-center"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out"
          }}
        >
          {/* MAPEAMOS homeClubs AQUÍ */}
          {homeClubs.map((club) => (
            <div key={club.id} className="col-12 col-xl-6">
              <div
                style={{
                  position: "relative",
                  backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.15), rgba(15, 23, 42, 0.75)), url(${club.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  borderRadius: "32px",
                  minHeight: "460px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "end",
                  overflow: "hidden",
                  boxShadow: "none",
                  border: "none"
                }}
              >
                <div
                  style={{
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    backgroundColor: "rgba(15, 23, 42, 0.65)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    borderRadius: "24px",
                    padding: "1rem 1.5rem",
                    margin: "0.5rem",
                    color: "#ffffff"
                  }}
                >
                  <span
                    className="fw-bold small text-uppercase mb-1 d-inline-block"
                    style={{ color: club.color, letterSpacing: "1px", fontSize: "0.75rem" }}
                  >
                    {club.badge}
                  </span>

                  <h3 className="fw-bold mb-1 text-white" style={{ fontSize: "1.5rem" }}>
                    {club.title}
                  </h3>

                  <p className="text-white-50 mb-3" style={{ lineHeight: "1.5", fontSize: "0.9rem" }}>
                    {club.desc}
                  </p>

                  <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2.5">
                    <div>
                      <span className="fw-bold fs-3 text-white">{club.displayPrice}</span>
                      <span className="text-white-50 small"> / mes</span>
                    </div>
                    <button
                      className="btn btn-light px-4 py-2 fw-bold hover-jump-btn"
                      style={{ borderRadius: "50px", fontSize: "1rem", color: "#0f172a", boxShadow: "0 4px 12px rgba(255,255,255,0.15)" }}
                      onClick={() => onAdd(club)}
                    >
                      Reservar Cupo <i className="bi bi-arrow-right ms-2" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

// ─── HOME MAIN ──────────────────────────────────────────────────────────────
export const Home = () => {
  const { setCart } = useCart();
  const navigate = useNavigate();
  const [showScrollTop, setShowScrollTop] = useState(false);

  const { setRef: refProx, isVisible: isVisibleProx } = useFadeIn(0.2);
  const { setRef: refTest, isVisible: isVisibleTest } = useFadeIn(0.15);

  const handleDirectCheckout = useCallback((item) => {
    setCart([item]);
    navigate("/cart");
  }, [setCart, navigate]);

  const suscripciones = useMemo(() =>
    servicios.filter(s =>
      s.category?.toLowerCase().includes("suscripción") ||
      s.category?.toLowerCase().includes("plan")
    ), []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setShowScrollTop(window.pageYOffset > 400);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <main style={{ minHeight: "100vh", paddingBottom: "5rem", backgroundColor: "#fdfbfb" }}>
      <style>
        {`
          .hover-jump-btn {
            transition: transform 0.3s ease, box-shadow 0.3s ease !important;
          }
          .hover-jump-btn:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15) !important;
          }
        `}
      </style>

      <Header />

      <div className="container-fluid px-md-5 mt-5">
        <SectionSlider
          title="Planes Mensuales"
          subtitle="Acompañamiento personalizado y seguimiento en vivo"
          items={suscripciones}
          onAdd={handleDirectCheckout}
        />
      </div>

      <ConversationClubs onAdd={handleDirectCheckout} />

      <div className="container-fluid px-md-5">
        <section
          ref={refProx}
          className="text-center py-5 px-4 mx-auto shadow-sm"
          style={{
            backgroundColor: "#f0f4f8",
            borderRadius: "16px",
            border: "2px dashed #0284c7",
            maxWidth: "950px",
            opacity: isVisibleProx ? 1 : 0,
            transform: isVisibleProx ? "translateY(0)" : "translateY(40px)",
            transition: "opacity 0.8s ease-out, transform 0.8s ease-out"
          }}
        >
          <span
            className="badge mb-3 text-uppercase fw-bold"
            style={{ backgroundColor: "#0284c7", fontSize: "0.75rem", letterSpacing: "1px", padding: "6px 12px" }}
          >
            Próximamente
          </span>
          <h2 className="fw-bold text-uppercase m-0" style={{ letterSpacing: "1.5px", color: "#1e3a8a" }}>
            Nuevas Experiencias Digitales
          </h2>
          <p className="text-muted mx-auto mt-3" style={{ maxWidth: "650px", fontSize: "0.95rem", lineHeight: "1.6" }}>
            Estamos diseñando herramientas educativas avanzadas para potenciar tu aprendizaje.
          </p>
        </section>

        <div className="my-5"><hr style={{ opacity: 0.1 }} /></div>

        <section className="container mb-5">
          <h2 className="text-center fw-bold text-uppercase mb-5" style={{ letterSpacing: "1px", color: "#1e3a8a" }}>
            Lo que dicen <span style={{ color: "#0284c7", fontWeight: "300" }}>nuestros estudiantes</span>
          </h2>
          <div
            ref={refTest}
            className="row g-4"
            style={{
              opacity: isVisibleTest ? 1 : 0,
              transform: isVisibleTest ? "translateY(0)" : "translateY(40px)",
              transition: "opacity 0.8s ease-out, transform 0.8s ease-out"
            }}
          >
            {testimonios.map(testimonio => (
              <div className="col-12 col-md-4" key={testimonio.id}>
                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "8px", borderTop: "4px solid #0284c7" }}>
                  <div className="card-body">
                    <p className="fw-bold mb-1" style={{ color: "#0f172a" }}>{testimonio.name}</p>
                    <div style={{ color: "#fbbf24", fontSize: "1.1rem", marginBottom: "8px" }}>
                      ★★★★★
                    </div>
                    <p className="card-text text-muted small" style={{ lineHeight: "1.6", fontStyle: "italic" }}>
                      "{testimonio.text}"
                    </p>
                    <small style={{ color: "#0369a1", fontWeight: "600" }}>
                      — Estudiante de Programa Conversacional
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="hover-jump-btn" 
          style={{
            position: "fixed", bottom: "30px", right: "30px",
            backgroundColor: "#1e3a8a",
            color: "#ffffff",
            border: "none", borderRadius: "50%",
            width: "50px", height: "50px",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(30,58,138,0.4)",
            cursor: "pointer", zIndex: 1000
          }}
        >
          <i className="bi bi-chevron-up" style={{ fontSize: "1.5rem", color: "#ffffff", WebkitTextStroke: "1px #ffffff" }} />
        </button>
      )}
    </main>
  );
};

const arrowStyle = {
  backgroundColor: "#ffffff",
  color: "#000000",
  border: "none",
  borderRadius: "50%",
  width: "42px",
  height: "42px",
  minWidth: "42px",
  boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.2rem",
  flexShrink: 0,
  WebkitTextStroke: "1px #000000"
};