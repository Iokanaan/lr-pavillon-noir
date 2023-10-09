import { mapSequelle, wordToInt } from "../utils/utils"

export const rollResultHandler = function(result: DiceResult, callback: DiceResultCallback) {
    callback('DiceResult', function(sheet: Sheet<unknown>) {
        // Gestion des jets d'attaque
        if(result.containsTag("attack")) {
            const res = result.children[0]
            sheet.get("result").text(res.children[0].total.toString() + " succès")
            const damage = parseIntTag(result.tags, /^damage_/)
            if(damage !== undefined) {
                sheet.get("degats").text((damage < 0 ? damage.toString() : "+" + damage.toString()) + " dégât(s)")
            }
            sheet.get("localisation").text(Tables.get("localisations").get(res.children[1].total.toString()).name)
        // Gestion des jets de séquelle
        } else if(result.containsTag("sequelle")) {
            handleSequelle(sheet, result)
        // Gestion par défaut
        } else {
            sheet.get("result").text(result.total.toString() + " succès")
        }
    })
}

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

// Fonction pour traduire la valeur d'un tag en integer
const parseIntTag = function(tags: string[], regex: RegExp): number | undefined {
    const res = tags.filter(function(e) { return regex.test(e) })
    if(res.length !== 0) {
        return wordToInt(res[0].split('_')[1])
    } else {
        return undefined
    }
}
