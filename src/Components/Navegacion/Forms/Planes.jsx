import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

// Importamos tanto planes como clubs desde servicios
import { planes, clubs } from '../../../servicios';
import { useCart } from '../../Context/CartContext'; 

export const Planes = () => {
  // Estado para la pestaña activa: 'academias' o 'club'
  const [activeTab, setActiveTab] = useState('academias');
  // Opacidad dinámica para simular un resplandor que reacciona levemente al scroll
  const [glowOffset, setGlowOffset] = useState(0);
  const [expandedCards, setExpandedCards] = useState({});
  const navigate = useNavigate();
  const { setCart } = useCart(); 

  useEffect(() => {
    AOS.init({ 
      duration: 1000, 
      once: false, 
      mirror: false 
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setGlowOffset(Math.min(scrollY * 0.15, 120));
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleInscripcion = useCallback((plan) => {
    setCart([plan]); 
    navigate('/cart'); 
  }, [setCart, navigate]);

  const toggleSaberMas = (id) => {
    setExpandedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Determinar qué planes renderizar consumiendo la data globalizada de servicios
  const planesFiltrados = activeTab === 'academias' ? planes : clubs;

  return (
    <div 
      style={{ 
        backgroundColor: '#0b0f19',
        backgroundImage: `
          radial-gradient(circle at 20% ${10% + glowOffset}px, rgba(56, 189, 248, 0.15) 0%, transparent 40%),
          radial-gradient(circle at 80% ${40% - glowOffset}px, rgba(30, 58, 138, 0.25) 0%, transparent 50%)
        `,
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        paddingTop: '6.5rem',
        paddingBottom: '6rem',
        transition: 'background-position 0.5s ease-out'
      }}
    >
      <style>
        {`
          .hover-jump-btn {
            transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease !important;
          }
          .hover-jump-btn:hover {
            transform: translateY(-4px) !important;
            box-shadow: 0 12px 24px rgba(56, 189, 248, 0.25) !important;
          }
          .tab-pill {
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            color: #94a3b8 !important;
          }
          .tab-pill.active {
            background-color: #ffffff !important;
            color: #0f172a !important;
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.1);
          }
          .tab-pill:not(.active):hover {
            color: #ffffff !important;
            background-color: rgba(255, 255, 255, 0.04);
          }
        `}
      </style>

      <div className="container mx-auto" style={{ maxWidth: '1400px' }}>
        
        {/* CABECERA DE LA PÁGINA */}
        <div className="text-center mb-4" data-aos="fade-down">
          <span 
            style={{ 
              backgroundColor: 'rgba(56, 189, 248, 0.1)', 
              color: '#38bdf8', 
              padding: '6px 18px', 
              borderRadius: '30px', 
              fontSize: '0.85rem', 
              fontWeight: '600',
              letterSpacing: '0.5px',
              border: '1px solid rgba(56, 189, 248, 0.15)'
            }} 
            className="d-inline-block mb-3"
          >
            Membresías Elite
          </span>
          <h1 className="fw-extrabold display-5 mb-3 text-white" style={{ letterSpacing: "-1.5px" }}>
            Invierte en tu Fluidez Real
          </h1>
          <p className="mx-auto" style={{ maxWidth: '550px', fontSize: '1.05rem', lineHeight: '1.6', color: '#94a3b8' }}>
            Planes meticulosamente calculados para hackear tu barrera lingüística a través de la práctica activa.
          </p>
        </div>

        {/* SELECTOR DE PESTAÑAS */}
        <div className="d-flex justify-content-center mb-5" data-aos="fade-up" data-aos-delay="100">
          <div 
            style={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.6)', 
              backdropFilter: 'blur(8px)',
              padding: '6px', 
              borderRadius: '50px', 
              border: '1px solid rgba(255, 255, 255, 0.08)' 
            }}
          >
            <button 
              onClick={() => setActiveTab('academias')}
              className={`btn px-4 py-2.5 fw-bold tab-pill ${activeTab === 'academias' ? 'active' : ''}`}
              style={{ borderRadius: '40px', fontSize: '0.9rem', border: 'none' }}
            >
              <i className="bi bi-mortarboard-fill me-2" /> Programas de Fluidez
            </button>
            <button 
              onClick={() => setActiveTab('club')}
              className={`btn px-4 py-2.5 fw-bold tab-pill ${activeTab === 'club' ? 'active' : ''}`}
              style={{ borderRadius: '40px', fontSize: '0.9rem', border: 'none' }}
            >
              <i className="bi bi-chat-quote-fill me-2" /> Club de Conversación
            </button>
          </div>
        </div>

        {/* GRILLA DINÁMICA DE TARJETAS */}
        <div className="row g-4 justify-content-center">
          {planesFiltrados.map((plan, index) => {
            const isExpanded = !!expandedCards[plan.id];

            return (
              <div 
                className="col-12 col-md-6 col-lg-4" 
                key={plan.id}
                data-aos="fade-up"
                data-aos-id={plan.id}
                data-aos-delay={index * 100}
              >
                <div 
                  className="h-100" 
                  style={{ 
                    position: "relative",
                    // Aseguramos soporte híbrido si se usa .img o .image
                    backgroundImage: `linear-gradient(to bottom, rgba(11, 15, 25, 0.1) 0%, rgba(11, 15, 25, 0.85) 100%), url(${plan.img || plan.image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    borderRadius: "28px", 
                    minHeight: "480px", 
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "end",
                    overflow: "hidden",
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    transition: "all 0.3s ease"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.015)";
                    e.currentTarget.style.borderColor = plan.color || "rgba(56, 189, 248, 0.3)";
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(11, 15, 25, 0.6)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    style={{
                      backdropFilter: "blur(18px)",
                      WebkitBackdropFilter: "blur(18px)",
                      backgroundColor: "rgba(11, 15, 25, 0.75)", 
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "22px",
                      padding: "1.25rem 1.4rem",
                      margin: "0.75rem",
                      color: "#ffffff",
                      display: "flex",
                      flexDirection: "column"
                    }}
                  >
                    {/* Categoría */}
                    <span
                      className="fw-bold text-uppercase mb-1 d-inline-block"
                      style={{ color: plan.color || "#38bdf8", letterSpacing: '1.2px', fontSize: "0.7rem" }}
                    >
                      {plan.category}
                    </span>

                    {/* Título */}
                    <div className="mb-2">
                      <h3 className="fw-bold m-0 text-white" style={{ fontSize: "1.35rem", letterSpacing: "-0.3px" }}>
                        {plan.name}
                      </h3>
                    </div>

                    {/* Información Desplegable */}
                    <div 
                      style={{ 
                        maxHeight: isExpanded ? "220px" : "0px", 
                        overflow: "hidden", 
                        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                        opacity: isExpanded ? 1 : 0
                      }}
                    >
                      <p 
                        className="p-3 mb-3 rounded-3" 
                        style={{ 
                          fontSize: "0.85rem", 
                          lineHeight: "1.5", 
                          backgroundColor: "rgba(255, 255, 255, 0.05)",
                          borderLeft: `3px solid ${plan.color || "#38bdf8"}`,
                          color: "#cbd5e1"
                        }}
                      >
                        {plan.desc}
                      </p>
                    </div>

                    {/* Bullets de Beneficios Rápidos (Con Optional Chaining seguro) */}
                    {plan.features && plan.features.length > 0 && (
                      <ul 
                        className="list-unstyled mb-3" 
                        style={{ 
                          fontSize: "0.75rem", 
                          lineHeight: "1.45", 
                          width: "100%",
                          display: "flex",
                          flexWrap: "wrap",     
                          columnGap: "14px",    
                          rowGap: "5px",        
                          padding: 0,
                          color: "#94a3b8"
                        }}
                      >
                        {plan.features.map((feature, i) => (
                          <li 
                            key={i} 
                            style={{ 
                              display: "flex",
                              alignItems: "center",
                              gap: "5px",
                              whiteSpace: "nowrap" 
                            }}
                          >
                            <i className="bi bi-check2-circle text-info" style={{ fontSize: "0.85rem" }} />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Footer de la Card */}
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 pt-2 border-top border-secondary border-opacity-10">
                      <div>
                        <span className="fw-bold fs-4 text-white">
                          {plan.displayPrice || `$${plan.price.toLocaleString()}`}
                        </span>
                        <span style={{ fontSize: "0.75rem", color: "#64748b" }}> / mes</span>
                      </div>

                      <div className="d-flex gap-2">
                        <button
                          onClick={() => toggleSaberMas(plan.id)}
                          className="btn btn-light px-3 py-2 fw-bold hover-jump-btn"
                          style={{ 
                            borderRadius: "50px", 
                            fontSize: "0.85rem", 
                            color: "#0f172a",
                            backgroundColor: "rgba(255, 255, 255, 0.9)"
                          }}
                        >
                          {isExpanded ? "Ocultar" : "Detalles"}
                        </button>
                        
                        <button
                          onClick={() => handleInscripcion(plan)}
                          className="btn px-4 py-2 fw-bold hover-jump-btn text-white"
                          style={{ 
                            borderRadius: "50px", 
                            fontSize: "0.85rem",
                            backgroundColor: "#1e3a8a",
                            border: "1px solid rgba(255, 255, 255, 0.1)"
                          }}
                        >
                          Unirme <i className="bi bi-arrow-right ms-1" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Planes;