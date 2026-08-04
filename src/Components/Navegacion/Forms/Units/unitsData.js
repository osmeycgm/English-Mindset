// Datos centralizados de todos los módulos
export const modulesData = {
    module1: {
        id: 1,
        name: "Stage 01: Foundations",
        units: Array.from({ length: 16 }, (_, i) => ({
            id: i + 1,
            title: `Unidad ${String(i + 1).padStart(2, '0')}`,
            subtitle: [
                "Mindset Tuning", "Breaking Ice", "Deep Dive", "Hadal Core",
                "Speed Boost", "Natural Flow", "Clarity Lab", "Global Voice",
                "Mindset Tuning", "Breaking Ice", "Deep Dive", "Hadal Core",
                "Speed Boost", "Natural Flow", "Clarity Lab", "Global Voice"
            ][i],
            duration: "1 Semana de Inmersión",
            image: `https://images.unsplash.com/photo-${[
                "1618005182384-a83a8bd57fbe", "1634017839464-5c339ebe3cb4",
                "1614741118887-7a4ee193a5fa", "1579783900882-c0d3dad7b119",
                "1618005182384-a83a8bd57fbe", "1634017839464-5c339ebe3cb4",
                "1614741118887-7a4ee193a5fa", "1579783900882-c0d3dad7b119",
                "1618005182384-a83a8bd57fbe", "1634017839464-5c339ebe3cb4",
                "1614741118887-7a4ee193a5fa", "1579783900882-c0d3dad7b119",
                "1618005182384-a83a8bd57fbe", "1634017839464-5c339ebe3cb4",
                "1614741118887-7a4ee193a5fa", "1579783900882-c0d3dad7b119"
            ][i]}?auto=format&fit=crop&w=600&q=80`,
            // Actividades — edita esto por unidad después
            actividades: [
                { id: 1, type: "video", title: "Masterclass: Estrategias del Día", duration: "12 min" },
                { id: 2, type: "pdf", title: "Cambridge Interactive Canvas", duration: "25 min" },
                { id: 3, type: "audio", title: "Audio Drill: Pronunciación Nativa", duration: "15 min" },
                { id: 4, type: "quiz", title: "Mindset Check: Desafío de Retención", duration: "8 min" },
            ]
        }))
    }
    // module2, module3, module4 — los agregas después copiando module1
}