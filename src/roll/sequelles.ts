import { mapSequelle } from "../utils/mappers"

// Fonction de gestion de la séquelle
export const handleSequelle = function(sheet: Sheet, result: DiceResult) {
    const sequelle = getSequelleData(result.total, result.tags)
    if(sequelle !== undefined) {
        sheet.get("result").text(sequelle.short_description)
    }
}


export const getSequelleData = function(total: number, tags: string[]) {
    let table: Table<SequelleEntity> | undefined = undefined
    let localisation: string | undefined = undefined
    // Récupération des données selon la localisation de la séquelle
    if(tags.indexOf('tete') !== -1) {
        table = Tables.get("sequelles_tete")
        localisation = _("Tête")
    } else if(tags.indexOf('torse') !== -1) {
        table = Tables.get("sequelles_torse")
        localisation = _("Torse")
    } else if(tags.indexOf('bras_droit') !== -1) {
        table = Tables.get("sequelles_bras")
        localisation = _("Bras droit")
    } else if(tags.indexOf('bras_gauche') !== -1) {
        table = Tables.get("sequelles_bras")
        localisation = _("Bras gauche")
    } else if(tags.indexOf('jambe_droite') !== -1) {
        table = Tables.get("sequelles_jambe")
        localisation = _("Jambe droite")
    } else if(tags.indexOf('jambe_gauche') !== -1) {
        table = Tables.get("sequelles_jambe")
        localisation = _("Jambe gauche")
    } else {
        log("Unknown sequelle type")
        return undefined
    }
    const sequelle: Sequelle[] = []
    table.each(function(e) {
        const currSequelle = mapSequelle(e)
        currSequelle.localisation = localisation
        if(total >= currSequelle.min && total <= currSequelle.max) {
            sequelle.push(currSequelle)
        }
    })
    if(sequelle.length > 0) {
        return sequelle[0]
    }
    log("Sequelle not found")
    return undefined
}
