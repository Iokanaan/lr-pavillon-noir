export const globalSheets: Record<number, PavillonSheet> = {}
export const globalPnjSheets: Record<number, PnjSheet> = {}
export const globalNavireSheets: Record<number, NavireSheet> = {}

export const optionalCompSlots: Record<string, number> = {
    "religion": 2,
    "conn_specialisee": 2,
    "art": 2,
    "artisanat": 2,
    "connaissances_colons_indigenes": 3,
    "connaissances_marins": 3,
    "langue_etrangere": 3,
    "arme_blanche": 4,
    "arme_trait": 2
}

export const typesComp = [
    "comp_maritimes", 
    "comp_connaissances", 
    "comp_techniques", 
    "comp_physiques", 
    "comp_sociales",
    "comp_combat"
]