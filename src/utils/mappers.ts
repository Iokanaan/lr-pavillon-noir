
// Fonctions de conversion des données des Tables
export const mapCompetence = function(entity: CompetenceEntity, cat: string): Competence {
    return {
        id: entity.id,
        name: entity.name,
        cc: entity.cc === "true",
        metier: entity.metier === "true",
        optional: entity.optional === "true",
        category: cat
    }
}

export const mapSequelle = function(e: SequelleEntity): Sequelle {
    return  {
        min: parseInt(e.min),
        max: parseInt(e.max),
        short_description: e.short_description,
        description: e.description,
        effect: e.effect
    }
}

export const mapCompetencePnj = function(e: CompetencePnjEntity): CompetencePnj {
    return {
        id: e.id,
        name: e.name,
        metier: e.metier === "true",
        category: e.category,
        attaque: e.attaque === "true",
        feu: e.feu === "true"
    }
}

export const mapTypeCanon = function(e: TypeCanonEntity): TypeCanon {
    return {
        id: e.id,
        name: e.name,
        label: e.label,
        calibre: +(e.calibre),
        pertes: +(e.pertes),
        nb_hommes: parseInt(e.nb_hommes),
        tonnage: +(e.tonnage),
        recharge: parseInt(e.recharge),
        eff_canonnade: parseInt(e.eff_canonnade),
        fac_canonnade: parseInt(e.fac_canonnade)       
    }
}

export const mapWeaponEntity = function(e: WeaponEntity): Weapon {
    return {
        id: e.id,
        attr: e.attr,
        type: e.type,
        modif_eff: parseInt(e.modif_eff),
        modif_fac: parseInt(e.modif_fac),
        portee: parseInt(e.portee),
        degats: parseInt(e.degats),
        recharge: e.recharge,
        comp: e.comp,
        modif_degats: e.modif_degats,
        mains: parseInt(e.mains) as 1 | 2,
        taille: e.taille,
        name: e.name,
        notes: e.notes
    }
}

export const mapLocalisation = function(e: LocalisationEntity): Localisation {
    return {
        id: parseInt(e.id),
        name: e.name,
        code: e.code
    }
}

export const mapPeuple = function(e: PeupleEntity): Peuple {
    return {
        id: e.id,
        name: e.name,
        ind_afr: e.ind_afr === "true"
    }
}

export const mapEscrime = function(e: EscrimeEntity): Escrime {
    const opp: number[] = []
    e.opportunites.split(';').forEach(function(str) {
        opp.push(parseInt(str))
    })
    return {
        id: e.id,
        name: e.name,
        opportunites: opp
    }
}