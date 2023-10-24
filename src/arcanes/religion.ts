import { effect } from "../utils/utils"

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
}