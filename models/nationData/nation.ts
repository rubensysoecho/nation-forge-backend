import { Politics } from './politics.ts';
import { Economy } from './economy';
import { History } from './history';
import { Demographics } from './demographics';
import { Geography } from './geography';
import { Culture } from './culture';

interface Nation {
    name: string;
    narrative: string;
    politics: Politics;
    economy: Economy;
    history: History;
    demographics: Demographics;
    geography: Geography;
    culture: Culture;
}

export { Nation }