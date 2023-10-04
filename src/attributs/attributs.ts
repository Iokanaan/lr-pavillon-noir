import { effect, resetModifiers, setVirtualBg } from "../utils/utils"

export const setupAttribut = function(sheet: PavillonSheet, attr: Attribut) {
    sheet.find(attr.id + "_label").on("click", function(cmp) {
        const target = sheet.find(attr.id + "_val").value() as number
        const selectedComp = sheet.selectedComp()
        if(selectedComp !== undefined) {
            handleCompRoll(sheet, selectedComp.name, selectedComp, target)
        } else {
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


