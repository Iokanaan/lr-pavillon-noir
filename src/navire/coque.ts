import { effect } from "../utils/utils"

export const setupCoque = function(sheet: NavireSheet) {
    
    sheet.find("structure_coque_title").on("click", function(cmp) {
        if(sheet.find("structure_coque_label").visible()) {
            sheet.find("structure_coque_label").hide()
            sheet.find("structure_coque_input").show()
        } else {
            sheet.find("structure_coque_label").show()
            sheet.find("structure_coque_input").hide()
        }
    })

    sheet.find("structure_coque_input").on("update", function(cmp) {
        cmp.hide()
        sheet.find("structure_coque_label").show()
        if(cmp.value() !== "") {
            sheet.find("structure_coque_label").value(cmp.value())
        } else {
            sheet.find("structure_coque_label").value(" ")
        }
        sheet.structure.maxCoque.set(+(cmp.value() as string))
    })


    sheet.find("reset_coque").on("click", function() {
        sheet.find("structure_coque_babord_input").value(sheet.structure.maxCoque())
        sheet.find("structure_coque_tribord_input").value(sheet.structure.maxCoque())
        sheet.find("structure_coque_poupe_input").value(sheet.structure.maxCoque())
        sheet.find("structure_coque_proue_input").value(sheet.structure.maxCoque())
    })

    effect(function() {
        sheet.find("degats_coque_babord").value(sheet.structure.coque.babord.degats())
    }, [sheet.structure.coque.babord.degats])
    effect(function() {
        sheet.find("degats_coque_tribord").value(sheet.structure.coque.tribord.degats())
    }, [sheet.structure.coque.tribord.degats])
    effect(function() {
        sheet.find("degats_coque_poupe").value(sheet.structure.coque.poupe.degats())
    }, [sheet.structure.coque.poupe.degats])
    effect(function() {
        sheet.find("degats_coque_proue").value(sheet.structure.coque.proue.degats())
    }, [sheet.structure.coque.proue.degats])

    sheet.find("structure_coque_babord_input").on("update", function(cmp) {
        sheet.structure.coque.babord.ps.set(cmp.value() as number)
    })
    sheet.find("structure_coque_tribord_input").on("update", function(cmp) {
        sheet.structure.coque.tribord.ps.set(cmp.value() as number)
    })
    sheet.find("structure_coque_poupe_input").on("update", function(cmp) {
        sheet.structure.coque.poupe.ps.set(cmp.value() as number)
    })
    sheet.find("structure_coque_proue_input").on("update", function(cmp) {
        sheet.structure.coque.proue.ps.set(cmp.value() as number)
    })
}