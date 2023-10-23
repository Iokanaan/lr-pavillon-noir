import { wordToInt } from "../utils/utils"
import { handleAttack } from "./attack"
import { handleSequelle } from "./sequelles"

export const resultCallback = function(result: DiceResult) {
    return function(sheet: Sheet<unknown>) {
        // Gestion des jets d'attaque
        if(result.containsTag("attack")) {
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
