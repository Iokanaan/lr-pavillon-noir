import { effect, resetModifiers, resetPnjModifiers, setVirtualBg } from "../utils/utils"

export const setupAttribut = function(sheet: PavillonSheet, attr: Attribut) {
    sheet.find(attr.id + "_label").on("click", function(cmp) {
        let target = sheet.find(attr.id + "_val").value() as number 
        const selectedComp = sheet.selectedComp()
        if(selectedComp !== undefined) {
            if(selectedComp.category !== "comp_connaissances") {
                target -= sheet.blessures.general.malus()
            }
            handleCompRoll(sheet, selectedComp.name, selectedComp, target)
        } else {
            if(attr.id === "ADR" || attr.id === "FOR" || attr.id === "RES") {
                target -= sheet.blessures.general.malus()
            }
            handleAttrRoll(sheet, cmp.text(), target)
        }
        resetModifiers(sheet)
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

export const setupPnjAttribut = function(sheet: PnjSheet, attr: Attribut) {
    sheet.find(attr.id + "_label").on("click", function(cmp) {
        let target = sheet.find(attr.id + "_val").value() as number 
        const selectedComp = sheet.selectedComp()
        if(selectedComp !== undefined) {
            handlePnjCompRoll(sheet, selectedComp.name.replace("·", ""), selectedComp, target)
        } else {
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

const handleCompRoll = function(sheet: PavillonSheet, title: string, selectedComp: Competence, target: number) {
    const nDice = sheet.find(selectedComp.id + "_val").value() as number
    const roll = new RollBuilder(sheet.raw()).title(title)
    if(nDice > 0) {
        roll.expression(nDice + "d10 <={1:2} " + target)
    } else {
        if(selectedComp.metier || hasMalusArmeAFeu(sheet, selectedComp.id)) {
            roll.expression("1d20 <={1:2} " + target)
        } else {
            roll.expression("1d12 <={1:2} " + target)
        }
    }
    roll.roll()
    sheet.selectedComp.set(undefined)
}

const handlePnjCompRoll = function(sheet: PnjSheet, title: string, selectedComp: CompetencePnj, target: number) {
    let nDice = sheet.find("competences_repeater").find(selectedComp.id).find("comp_val").value() as number
    nDice += parseInt(sheet.find("competences_repeater").find(selectedComp.id).find("modifier").value())
    const roll = new RollBuilder(sheet.raw()).title(title)
    if(nDice > 0) {
        roll.expression(nDice + "d10 <={1:2} " + target)
    } else {
        if(selectedComp.metier) {
            roll.expression("1d20 <={1:2} " + target)
        } else {
            roll.expression("1d12 <={1:2} " + target)
        }
    }
    roll.roll()
    sheet.selectedComp.set(undefined)
}


const handleAttrRoll = function(sheet: PavillonSheet | PnjSheet, title: string, target: number) {
    new RollBuilder(sheet.raw())
        .title(title)
        .expression("2d10 <={1:2} " + target)
        .roll()
}

// Fonction un peu moche pour prendre en compte l'origine pour les compétences d'arme a feu
export const hasMalusArmeAFeu = function(sheet: PavillonSheet, selectedComp: CompetenceEnum) {
    const isCompArmeAFeu = ["mousquet", "grenade", "pistolet"].indexOf(selectedComp) !== -1
    if(!isCompArmeAFeu) {
        return false
    }
    if(!sheet.origine().indAfr) {
        return false
    }
    if(sheet.origine().id === "indiens_mosquitos" && selectedComp === "mousquet") {
        return false
    }
    return true
}