import { parseIntTag } from "./rollHandler"

export const handleCanonnade = function(sheet: Sheet, result: DiceResult) {
    sheet.get("result").text(result.children[0].total.toString() + " succès")
    sheet.get("localisation").text(getLocalisationCoque(result.children[1].total))
}

const getLocalisationCoque = function(loc: number) {
    switch(loc) {
        case 1:
            return "Poupe"
        case 6:
            return "Proue"
        default:
            return "Entrepont"
    }
}