interface Economy {
    resources: Resource[];
    legal_framework: LegalFramework;
}
  
interface Resource {
    name: string;
    quantity: number;
    unit: string;
}
  
interface LegalFramework {
    economic: string;
    trade: string;
}

export {Economy}