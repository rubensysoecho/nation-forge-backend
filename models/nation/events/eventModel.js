import mongoose, { Schema } from 'mongoose';

// Esquema personalizado para manejar fechas históricas
const eventSchema = new Schema({
    id: {
        type: Schema.Types.UUID,
        default: () => new mongoose.Types.UUID(),
        unique: true,
        required: true
    },
    title: { type: String, required: true },
    type: { type: String, required: true },
    description: { type: String, default: "" },
    date: { 
        type: Schema.Types.Mixed, // Cambiado de Date a Mixed para aceptar tanto Date como String
        required: true,
        validate: {
            validator: function(value) {
                // Si es un string que empieza con '-' (año negativo), validar formato YYYY-MM-DD
                if (typeof value === 'string' && value.startsWith('-')) {
                    return /^-\d{4}-\d{2}-\d{2}$/.test(value);
                }
                
                // Si no es un string negativo, intentar convertir a Date
                try {
                    new Date(value);
                    return true;
                } catch (error) {
                    return false;
                }
            },
            message: props => `${props.value} no es una fecha válida. Use formato YYYY-MM-DD para fechas antiguas.`
        }
    },
}, { discriminatorKey: 'type' });

const Event = mongoose.model('Event', eventSchema);

export { Event, eventSchema };