import { intToWord, resetModifiers, setVirtualBg } from "../utils/utils"

export const setupAttribut = function(sheet: PavillonSheet, attr: Attribut) {
    sheet.find(attr.id + "_label").on("click", function(cmp) {
        cmp.addClass("text-info")
        wait(2000, function() {
            cmp.removeClass("text-info")
        })
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


const handleCompRoll = function(sheet: PavillonSheet, title: string, selectedComp: Competence, target: number) {
    const nDice = sheet.find(selectedComp.id + "_val").value() as number
    const roll = new RollBuilder(sheet.raw()).title(title)
    const tags =  "[eff_" + intToWord(nDice) + ",fac_" + intToWord(target) + "]"
    if(nDice > 0) {
        roll.expression("(" + nDice + "d10 <={1:2} " + target + ")" + tags)
    } else {
        if(selectedComp.metier || hasMalusArmeAFeu(sheet, selectedComp.id)) {
            roll.expression("(1d20 <={1:2} " + target + ")" + tags)
        } else {
            roll.expression("(1d12 <={1:2} " + target + ")" + tags)
        }
    }
    roll.roll()
    sheet.selectedComp.set(undefined)
}



const handleAttrRoll = function(sheet: PavillonSheet | PnjSheet, title: string, target: number) {
    new RollBuilder(sheet.raw())
        .title(title)
        .expression("(2d10 <={1:2} " + target + ")[eff_" + intToWord(2) + ",fac_" + intToWord(target) + "]")
        .roll()
}

export const setupFastRoll = function(sheet: PavillonSheet | PnjSheet) {
    sheet.find("fast_roll").on("click", function() {
        let eff = sheet.find("fast_eff").value() as number
        const fac = sheet.find("fast_fac").value() as number
        let dice = 10
        if(eff !== undefined 
        && fac !== undefined  
        && eff !== null
        && fac !== null) {
            if(eff === 0) {
                eff = 1
                dice = 12
            }
            new RollBuilder(sheet.raw())
            .title("Jet rapide")
            .expression("(" + eff + "d" + dice + " <={1:2} " + fac + ")[eff_" + intToWord(eff) + ",fac_" + intToWord(fac) + "]")
            .roll()
        }
    })
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