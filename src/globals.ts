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

export const competencesGroupe = {
    combat: {
        capitaine: ["meneur_hommes", "tactique"],
        second: ["meneur_hommes"],
        canonnier: ["meneur_hommes"]
    },
    canonnade: {
        capitaine: ["balistique"],
        mequipage: ["balistique"],
        second: ["meneur_hommes"],
        mcanonnier: ["pointage_pieces"]
    },
    recharge: {
        canonnier: ["meneur_hommes"],
        mcanonnier: ["recharge_pieces"],
        mequipage: ["intimidation"],
        qmaitre: ["conn_nautiques"]
    },
    manoeuvre: {
        capitaine: ["hydrographie"],
        second: ["conn_nautiques"],
        mequipage: ["pratique_nautique"],
        qmaitre: ["timonerie"]
    },
    habilete: {
        capitaine: ["meneur_hommes"]
    },
    ruse: {
        capitaine: ["meneur_hommes"],
        second: ["tactique"],
        canonnier: ["vigilance"],
        qmaitre: ["discretion"]
    },
}

export const gestion: Record<string, CompetenceEnum[]> = {
    capitaine: ["commerce", "navigation"],
    pilote: ["cartographie", "hydrographie", "geographie"],
    calfat: ["calfatage", "conn_navires", "ing_navale"],
    charpentier: ["conn_navires", "ing_navale", "charpenterie"],
    voilier: ["conn_navires", "ing_navale", "voilerie"],
    chirurgien: ["chirurgie", "medecine", "herboristerie"],
    qmaitre: ["empathie", "enseignement", "persuasion"],
    cambusier: ["cuisine", "intendance"],
    grenadier: ["grenade", "mousquet"],
    vigie: ["mousquet", "vigilance"]
}

export const postes: Record<PosteBord, CompetenceEnum[]> = { 
    capitaine: ["balistique", "tactique", "meneur_hommes", "hydrographie"],
    second: ["conn_nautiques", "tactique", "meneur_hommes"],
    canonnier: ["vigilance", "meneur_hommes"],
    mequipage: ["pratique_nautique", "balistique", "intimidation"],
    qmaitre: ["timonerie", "discretion", "conn_nautiques"],
    mcanonnier: ["pointage_pieces", "recharge_pieces", "conn_nautiques"]
}