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
}

const handleCompRoll = function(sheet: PavillonSheet, title: string, selectedComp: Competence, target: number) {
    const nDice = sheet.find(selectedComp.id + "_val").value() as number
    const roll = new RollBuilder(sheet.raw()).title(title)
    if(nDice > 0) {
        roll.expression(nDice + "d10 <={1:2} " + target)
    } else {
        roll.expression("1d12 <={1:2} " + target)
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

