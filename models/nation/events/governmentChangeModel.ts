import { Schema } from 'mongoose';
import { Event } from './eventModel.ts';

const governmentChangeEventSchema = new Schema({
    previousGovernment: { type: String, default: "" },
    newGovernment: { type: String, default: "" },
});
const GovernmentChangeEvent = Event.discriminator('governmentChange', governmentChangeEventSchema);
export { GovernmentChangeEvent, governmentChangeEventSchema };