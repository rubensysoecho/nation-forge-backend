interface Politics {
    exterior: ExteriorPolitics;
    interior: InteriorPolitics;
}

interface ExteriorPolitics {
    wars: War[];
    alliances: Alliance[];
}

interface InteriorPolitics {
    government_type: string;
    political_ideology: string;
    leaders: Leader[];
    tensions: Tensions;
}

interface War {
    name: string;
    causas: string;
    beligerantes: Beligerante[];
    duracion: string;
    resultados: string;
    bajas: Bajas;
    impacto: string;
    eventos_clave: EventoClave[];
}
  
interface Beligerante {
    nacion: string;
    bando: string;
}
  
interface Bajas {
    militares: number;
    civiles: number;
}
  
interface EventoClave {
    tipo: string;
    ubicacion: string;
    fecha: string;
    descripcion: string;
}
  
interface Alliance {
    name: string;
    members: string[];
}

interface Leader {
    name: string;
    title: string;
    start_date: string;
    end_date: string | null; // Puede ser null si el líder aún está en el cargo
}
  
interface Tensions {
    cultural: Tension[];
    religious: Tension[];
    political: Tension[];
}
  
interface Tension {
    organization: string;
    demands?: string; // Algunas tensiones no tienen demandas
    beliefs?: string; // Para tensiones religiosas
    actions: string;
}

export {Politics, EventoClave}