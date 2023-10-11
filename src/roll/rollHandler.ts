import { wordToInt } from "../utils/utils"
import { handleSequelle } from "./sequelles"

export const resultCallback = function(result: DiceResult) {
    return function(sheet: Sheet<unknown>) {
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
    }
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
