import { useRef, useState, useEffect, useMemo, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { servicios, recetas, testimonios } from "../../servicios";
import { CardServicio } from "./CardServicio/CardServicio";
import { Header } from "./Header/Header";
import { useCart } from "../Context/CartContext";

// ─── COMPONENTE SLIDER MEMOIZADO ────────────────────────────────────────────
const SectionSlider = memo(({ title, subtitle, items, onAdd }) => {
    const [index, setIndex] = useState(0);
    const VISIBLE = 3;
    const total = items.length;

    const prev = useCallback(() => {
        setIndex(i => (i === 0 ? total - VISIBLE : i - 1));
    }, [total]);

    const next = useCallback(() => {
        setIndex(i => (i >= total - VISIBLE ? 0 : i + 1));
    }, [total]);

    const visibleItems = items.slice(index, index + VISIBLE);

    return (
        <section style={{ position: "relative", padding: "0 10px" }}>
            <div className="text-center mb-4">
                <h2 className="fw-bold text-uppercase m-0" style={{ letterSpacing: "1.5px" }}>
                    {title}
                </h2>
                <p className="text-muted small">{subtitle}</p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* Flecha izquierda */}
                <button onClick={prev} style={arrowStyle}>
                    <i className="bi bi-chevron-left" />
                </button>

                {/* 3 cards visibles */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: "20px",
                    flex: 1,
                    overflow: "hidden"
                }}>
                    {visibleItems.map(item => (
                        <CardServicio
                            key={item.id}
                            {...item}
                            onAgregar={() => onAdd(item)}
                        />
                    ))}
                </div>

                {/* Flecha derecha */}
                <button onClick={next} style={arrowStyle}>
                    <i className="bi bi-chevron-right" />
                </button>
            </div>

            {/* Indicador de posición */}
            <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "16px" }}>
                {Array.from({ length: total - VISIBLE + 1 }).map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setIndex(i)}
                        style={{
                            width: "8px", height: "8px", borderRadius: "50%",
                            backgroundColor: i === index ? "#7b2ff7" : "#ccc",
                            cursor: "pointer", transition: "background 0.3s"
                        }}
                    />
                ))}
            </div>

            <div className="text-center mt-4">
                <Link
                    to="/proximamente-servicios"
                    className="btn btn-outline-dark px-5 fw-bold"
                    style={{ borderRadius: "25px", fontSize: "0.85rem" }}
                >
                    Ver más planes
                </Link>
            </div>
        </section>
    );
});

// ─── HOME ───────────────────────────────────────────────────────────────────
export const Home = () => {
    const { agregarAlCarrito } = useCart();
    const [showScrollTop, setShowScrollTop] = useState(false);

    // Memoizado — solo se recalcula si servicios cambia
    const suscripciones = useMemo(() =>
        servicios.filter(s =>
            s.category?.toLowerCase().includes("suscripción") ||
            s.category?.toLowerCase().includes("plan")
        ), []);

    const grabados = useMemo(() =>
        servicios.filter(s =>
            s.category?.toLowerCase().includes("grabado")
        ), []);

    // Scroll throttleado con requestAnimationFrame — sin re-renders innecesarios
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
    }, []); // ← sin dependencias, se monta una sola vez

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <main style={{ minHeight: "100vh", paddingBottom: "5rem", backgroundColor: "#fdfbfb" }}>
            <Header />

            <div className="container-fluid px-md-5 mt-5">

                {/* SUSCRIPCIONES */}
                <SectionSlider
                    title="Plan de Suscripción"
                    subtitle="Acompañamiento personalizado y seguimiento en vivo"
                    items={suscripciones}
                    onAdd={agregarAlCarrito}
                />

                <div className="my-5"><hr style={{ opacity: 0.1 }} /></div>

                {/* GRABADOS */}
                <SectionSlider
                    title="Paquete de Videos"
                    subtitle="Entrenamientos grabados para ver cuando quieras"
                    items={grabados}
                    onAdd={agregarAlCarrito}
                />

                <div className="my-5"><hr style={{ opacity: 0.1 }} /></div>

                {/* RECETAS */}
                <section className="container text-center">
                    <h2 className="fw-light text-uppercase mb-5" style={{ letterSpacing: "2px", color: "#555" }}>
                        Revisa Nuestras Recetas
                    </h2>
                    <div className="row g-4 text-start">
                        {recetas.map(receta => (
                            <div className="col-12 col-md-6 col-lg-3" key={receta.id}>
                                <div className="card border-0 bg-transparent">
                                    <img
                                        src={receta.img}
                                        className="card-img-top mb-3"
                                        alt={receta.title}
                                        loading="lazy"  // ← lazy load
                                        style={{ borderRadius: "0" }}
                                    />
                                    <h5 className="fw-light text-muted" style={{ fontSize: "1.1rem", lineHeight: "1.4" }}>
                                        {receta.title}
                                    </h5>
                                    {receta.extra && (
                                        <small className="text-muted" style={{ fontSize: "0.8rem" }}>
                                            {receta.extra}
                                        </small>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-5">
                        <Link to="/proximamente-recetas" className="btn btn-outline-dark px-5 fw-bold" style={{ borderRadius: "25px" }}>
                            Ver más recetas
                        </Link>
                    </div>
                </section>

                <div className="my-5"><hr style={{ opacity: 0.1 }} /></div>

                {/* TESTIMONIOS */}
                <section className="container mb-5">
                    <h2 className="text-center fw-bold text-uppercase mb-5" style={{ letterSpacing: "1px", color: "#5a0038" }}>
                        Comentarios <span style={{ color: "#000", fontWeight: "300" }}>de mis Alumnos</span>
                    </h2>
                    <div className="row g-4">
                        {testimonios.map(testimonio => (
                            <div className="col-12 col-md-4" key={testimonio.id}>
                                <div className="card h-100 shadow-sm border-0" style={{ borderRadius: "5px" }}>
                                    <div className="card-body">
                                        <p className="fw-bold mb-1">{testimonio.name}</p>
                                        <div style={{ color: "#f39c12", fontSize: "1.1rem", marginBottom: "8px" }}>
                                            ★★★★★
                                        </div>
                                        <p className="card-text text-muted small" style={{ lineHeight: "1.6" }}>
                                            {testimonio.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* BOTÓN VOLVER ARRIBA */}
            {showScrollTop && (
                <button
                    onClick={scrollToTop}
                    style={{
                        position: "fixed", bottom: "30px", right: "30px",
                        backgroundColor: "#7b2ff7", color: "#fff",
                        border: "none", borderRadius: "50%",
                        width: "50px", height: "50px",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(123,47,247,0.4)",
                        cursor: "pointer", zIndex: 1000
                    }}
                >
                    <i className="bi bi-chevron-up" style={{ fontSize: "1.3rem" }} />
                </button>
            )}
        </main>
    );
};

// ─── ESTILOS FLECHA ──────────────────────────────────────────────────────────
const arrowStyle = {
    backgroundColor: "white", border: "none", borderRadius: "50%",
    width: "42px", height: "42px", minWidth: "42px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
    cursor: "pointer", display: "flex", alignItems: "center",
    justifyContent: "center", fontSize: "1.1rem", flexShrink: 0
};