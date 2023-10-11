
// Fonctions de conversion des données des Tables
export const mapCompetence = function(entity: CompetenceEntity): Competence {
    return {
        id: entity.id,
        name: entity.name,
        cc: entity.cc === "true",
        metier: entity.metier === "true",
        optional: entity.optional === "true"
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

export const mapPeuple = function(e: PeupleEntity): Peuple {
    return {
        id: e.id,
        name: e.name,
        ind_afr: e.ind_afr === "true"
    }
}