import { wordToInt } from "../utils/utils"
import { handleAttack } from "./attack"
import { handleSequelle } from "./sequelles"

export const resultCallback = function(result: DiceResult) {
    return function(sheet: Sheet<unknown>) {
        const eff = parseIntTag(result.allTags, /eff_/)
        const fac = parseIntTag(result.allTags, /fac_/)
        if(eff !== undefined && fac !== undefined) {
            sheet.get("formule").text(eff + " F " + fac)
        }
        if(result.containsTag("initiative")) {
            sheet.get("result").text(result.total.toString())
        // Gestion des jets d'attaque
        } else if(result.containsTag("attack")) {
            handleAttack(sheet, result)
        // Gestion des jets de séquelle
        } else if(result.containsTag("sequelle")) {
            handleSequelle(sheet, result)
        // Gestion par défaut
        } else {
            sheet.get("result").text(result.total.toString() + " succès")
        }
    }
}

// Fonction pour traduire la valeur d'un tag en integer
export const parseIntTag = function(tags: string[], regex: RegExp): number | undefined {
    const res = tags.filter(function(e) { return regex.test(e) })
    if(res.length !== 0) {
        return wordToInt(res[0].split('_')[1])
    } else {
        return undefined
    }
}
