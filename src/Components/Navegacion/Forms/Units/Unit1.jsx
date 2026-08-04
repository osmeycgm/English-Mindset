// Unit1.jsx — contenido específico, edita después
import Unit from "./unit"
import { modulesData } from "./unitsData"

const Unit1 = ({ onVolver }) => {
    const unidad = modulesData.module1.units[0]  // índice 0 = unidad 1
    return <Unit unidad={unidad} onVolver={onVolver} />
}

export default Unit1