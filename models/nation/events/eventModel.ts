import mongoose, { Schema, Model } from 'mongoose';

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
    date: { type: Date, required: true },
}, { discriminatorKey: 'type' });

const Event: Model<any> = mongoose.model('Event', eventSchema);

export { Event, eventSchema };
