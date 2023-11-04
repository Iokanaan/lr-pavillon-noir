import { parseIntTag } from "./rollHandler"

export const handleAttack = function(sheet: Sheet, result: DiceResult) {
    const res = result.children[0]
    let nbSuccess = 0
    let longFeu = 1
    if(result.allTags.indexOf("long_feu") !== -1) {
        nbSuccess = res.children[0].children[0].total
        longFeu = res.children[0].children[1].total
    } else {
        nbSuccess = res.children[0].total
    }

    sheet.get("result").text(res.children[0].children[0].total.toString() + " succès")
    const damage = parseIntTag(result.tags, /^damage_/)
    if(damage !== undefined && damage !== 0) {
        sheet.get("degats").text((damage < 0 ? damage.toString() : "+" + damage.toString()) + " dégât(s)")
    }
    sheet.get("localisation").text(Tables.get("localisations").get(res.children[1].total.toString()).name)
    if(longFeu !== 0) {
        sheet.get("long_feu").hide()    
    } else {
        sheet.get("long_feu").show()
    }
}