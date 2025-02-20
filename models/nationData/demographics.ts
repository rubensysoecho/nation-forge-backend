interface Demographics {
    population: Population;
    cultures: string[];
    occupations: string[];
}
  
interface Population {
    size: number;
    ethnicities: string[];
}

export {Demographics}