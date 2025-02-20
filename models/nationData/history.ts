import { EventoClave } from "./politics";

interface History {
    origin: string;
    key_events: EventoClave[]; // Reutilizamos la interfaz EventoClave
}

export { History }