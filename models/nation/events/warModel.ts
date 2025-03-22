import { Schema } from 'mongoose';
import { Event } from './eventModel.ts';
const WarEventSchema = new Schema({
    belligerents: { type: [String], default: [] },
    casusBelli: { type: String, default: "" },
    duration: { type: String, default: "" },
    outcome: { type: String, default: "" },
    casualties: { type: String, default: "" },
});
const WarEvent = Event.discriminator('guerra', WarEventSchema);
export { WarEvent, WarEventSchema };