import { intToWord, resetPnjModifiers, setVirtualBg } from "../utils/utils"

const handlePnjCompRoll = function(sheet: PnjSheet, title: string, selectedComp: CompetencePnj, target: number) {
    let nDice = sheet.find("competences_repeater").find(selectedComp.id).find("comp_val").value() as number
    nDice += parseInt(sheet.find("competences_repeater").find(selectedComp.id).find("modifier").value())
    const roll = new RollBuilder(sheet.raw()).title(title)
    let expression = ""
    const rollTags =  "eff_" + intToWord(nDice) + ",fac_" + intToWord(target) 
    if(nDice > 0) {
        expression += nDice + "d10 <={1:2} " + target
    } else {
        if(selectedComp.metier) {
            expression += "1d20 <={1:2} " + target
        } else {
            expression += "1d12 <={1:2} " + target
        }
    }
    if(selectedComp.attaque) {
        expression = "(" + expression + ")"
        if(selectedComp.feu) {
            expression += " + (1d20 > " + sheet.find("competences_repeater").find(selectedComp.id).find("long_feu_val").value() + ")[long_feu]"
        }
        expression += " + 1d6[localisation]"
        expression = "(" + expression + ")[attack,damage_" + intToWord(sheet.find("competences_repeater").find(selectedComp.id).find("degats_val").value()) + "," + rollTags + "]"
    } else {
        expression = "(" + expression + ")[" + rollTags + "]"
    }
    
    roll.expression(expression)
    roll.roll()
    sheet.selectedComp.set(undefined)
}

export const setupPnjAttribut = function(sheet: PnjSheet, attr: Attribut) {
    sheet.find(attr.id + "_label").on("click", function(cmp) {
        let target = sheet.find(attr.id + "_val").value() as number 
        const selectedComp = sheet.selectedComp()
        if(selectedComp !== undefined) {
            if(selectedComp.category !== "connaissances") {
                target -= sheet.blessures.general.malus()
            }
            handlePnjCompRoll(sheet, selectedComp.name.replace("·", ""), selectedComp, target)
        } else {
            if(attr.id === "ADR" || attr.id === "FOR" || attr.id === "RES") {
                target -= sheet.blessures.general.malus()
            }
            handleAttrRoll(sheet, cmp.text(), target)
        }
        resetPnjModifiers(sheet)
    })

    sheet.find(attr.id + "_plus").on("click", function() {
        const attrCmp = sheet.find(attr.id + "_val") as Component<number>
        attrCmp.virtualValue(attrCmp.value() + 1)
        setVirtualBg(attrCmp)
    })
    sheet.find(attr.id + "_minus").on("click", function() {
        const attrCmp = sheet.find(attr.id + "_val") as Component<number>
        if(attrCmp.value() > 0) {
            attrCmp.virtualValue(attrCmp.value() - 1)
            setVirtualBg(attrCmp)
        }
    });
    (sheet.find(attr.id + "_val") as Component<number>).on("update", function(cmp) {
        sheet.attr[attr.id].set(cmp.value())
    })
}

const handleAttrRoll = function(sheet: PavillonSheet | PnjSheet, title: string, target: number) {
    const tags =  "[eff_" + intToWord(2) + ",fac_" + intToWord(target) + "]"
    new RollBuilder(sheet.raw())
        .title(title)
        .expression("(2d10 <={1:2} " + target + ")" + tags)
        .roll()
}