import { computed, signal } from "../utils/utils"

export const setupAttribut = function(sheet: PavillonSheet, attr: Attribut) {
    sheet.find(attr.id + "_label").on("click", function(cmp) {
        const target = sheet.find(attr.id + "_val").value() as number
        const selectedComp = sheet.selectedComp()
        if(selectedComp !== undefined) {
            handleCompRoll(sheet, selectedComp.name, selectedComp, target)
        } else {
            handleAttrRoll(sheet, cmp.text(), target)
        }
    })
    sheet.attr[attr.id] = signal(sheet.find(attr.id + "_val").value() as number);
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
        if(selectedComp.metier) {
            roll.expression("1d20 <={1:2} " + target)
        } else {
            roll.expression("1d12 <={1:2} " + target)
        }
    }
    roll.roll()
    sheet.selectedComp.set(undefined)
}

const handleAttrRoll = function(sheet: PavillonSheet, title: string, target: number) {
    new RollBuilder(sheet.raw())
        .title(title)
        .expression("2d10 <={1:2} " + target)
        .roll()
}

export const setupValeurMetier = function(sheet: PavillonSheet) {
    computed(function() {
        for(let i=0;i<2;i++) {
            const profession = sheet.professions[i]()
            if(profession !== undefined) {
                sheet.find("valeur_metier_label_" + (i+1)).value(profession.name)
                sheet.find("valeur_metier_val_" + (i+1)).value(Math.round(
                    (sheet.attr[profession.attr_1]() + 
                    sheet.attr[profession.attr_2]()) / 2))
                sheet.find("valeur_metier_label_" + (i+1)).show()
                sheet.find("valeur_metier_val_" + (i+1)).show()
            } else {
                sheet.find("valeur_metier_label_" + (i+1)).hide()
                sheet.find("valeur_metier_val_" + (i+1)).hide()
            }
        }

    }, [
        sheet.professions[0], 
        sheet.professions[1], 
        sheet.attr['ADA'], 
        sheet.attr['FOR'], 
        sheet.attr['ADR'], 
        sheet.attr['PER'], 
        sheet.attr['EXP'], 
        sheet.attr['CHA'], 
        sheet.attr['POU'],
        sheet.attr['RES'],
        sheet.attr['ERU']
    ])
}

