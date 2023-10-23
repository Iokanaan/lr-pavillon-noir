export const setupReligionArcane = function(sheet: PavillonSheet) {
    effect(function() {
        sheet.find("religion_arcanes").value(sheet.religion())
    }, [sheet.religion])
    sheet.find("type_religion").on("update", function(cmp) {
        sheet.typeArcane.set(cmp.value() as "communion" | "possession")
    })
}

export const setupName = function(sheet : PavillonSheet) {
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
        cmp.hide()
        sheet.find("nom_arcanes_val").show()
    })
}