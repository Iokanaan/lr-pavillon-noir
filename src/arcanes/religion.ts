import { effect, resetModifiers, setVirtualBg, signal } from "../utils/utils"

export const setupArcanes = function(sheet: PavillonSheet) {
    effect(function() {
        sheet.find("religion_arcanes").value(sheet.religion())
        sheet.find("arcanes_comp_val").value(sheet.religion())
    }, [sheet.religion])
    sheet.find("type_arcarne").on("update", function(cmp) {
        sheet.typeArcane.set(cmp.value() as "communion" | "possession")
    })

    sheet.find("nom_arcanes_label").on("click", function() {
        if(sheet.find("nom_arcanes_val").visible()) {
            sheet.find("nom_arcanes_input").show()
            sheet.find("nom_arcanes_val").hide()
        } else {
            sheet.find("nom_arcanes_input").hide()
            sheet.find("nom_arcanes_val").show()
        }
    })
    sheet.find("nom_arcanes_input").on("update", function(cmp) {
        sheet.find("nom_arcanes_val").value(cmp.value())
        cmp.hide()
        sheet.find("nom_arcanes_val").show()
    })
    effect(function() {
        sheet.find("arcanes_faveurs").value(sheet.faveurs())
    }, [sheet.faveurs])

    setupComp(sheet, "religion_arcane", "ERU")
    setupComp(sheet, "obj_pouvoir", "CHA")


    
}

const setupComp = function(sheet: PavillonSheet, compId: string, attr: AttributEnum) {

    sheet.find(compId + "_label").on("click", function() {
        const eff = sheet.find(compId + "_val").value() as number;
        if(eff > 0) {
            new RollBuilder(sheet.raw())
                .expression(sheet.find(compId + "_val").value() + "d10 <={1:2} " + sheet.find(attr + "_val").value())
                .title("")
                .roll()
        } else {
            new RollBuilder(sheet.raw())
                .expression("1d12 <={1:2} " + sheet.find(attr + "_val").value())
                .title("")
                .roll()
        }
        sheet.find(compId + "_val").virtualValue(null)
        setVirtualBg(sheet.find(compId + "_val") as Component<number>)
        resetModifiers(sheet)
    })

    sheet.find(compId + "_plus").on("click", function() {
        const compCmp = sheet.find(compId + "_val") as Component<number>
        compCmp.virtualValue(compCmp.value() + 1)
        setVirtualBg(compCmp)
    })
    sheet.find(compId + "_minus").on("click", function() {
        const compCmp = sheet.find(compId + "_val") as Component<number>
        if(compCmp.value() > 0) {
            compCmp.virtualValue(compCmp.value() - 1)
            setVirtualBg(compCmp)
        }
    })
}