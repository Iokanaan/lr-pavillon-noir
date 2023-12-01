import { effect } from "../utils/utils"

export const registreNavire = function(sheet: NavireSheet, label: string) {
    sheet.find(label + "_title").on("click", function(cmp) {
        if(sheet.find(label + "_label").visible()) {
            sheet.find(label + "_label").hide()
            sheet.find(label + "_input").show()
        } else {
            sheet.find(label + "_label").show()
            sheet.find(label + "_input").hide()
        }
    })

    sheet.find(label + "_input").on("update", function(cmp) {
        cmp.hide()
        sheet.find(label + "_label").show()
        if(cmp.value() !== "") {
            sheet.find(label + "_label").value(cmp.value())
        } else {
            sheet.find(label + "_label").value(" ")
        }
    })
}

export const setupEffects = function(sheet: NavireSheet) {
    effect(function() {
        sheet.find("mini_recharge_label").value(sheet.equipage.miniRecharge())
    }, [sheet.equipage.miniRecharge])

    effect(function() {
        if(sheet.equipage.maxi() < sheet.equipage.actuel()) {
            sheet.find("equipe_maxi_label").addClass("text-danger")
        } else {
            sheet.find("equipe_maxi_label").removeClass("text-danger")
        }
    }, [sheet.equipage.maxi, sheet.equipage.actuel])

    effect(function() {
        if(sheet.equipage.miniRecharge() > sheet.equipage.actuel()) {
            sheet.find("mini_recharge_label").addClass("text-danger")
        } else {
            sheet.find("mini_recharge_label").removeClass("text-danger")
        }
    }, [sheet.equipage.miniRecharge, sheet.equipage.actuel])

    effect(function() {
        if(sheet.equipage.miniManoeuvre() > sheet.equipage.actuel()) {
            sheet.find("mini_manoeuvre_label").addClass("text-danger")
        } else {
            sheet.find("mini_manoeuvre_label").removeClass("text-danger")
        }
    }, [sheet.equipage.miniManoeuvre, sheet.equipage.actuel])

    sheet.find("mini_manoeuvre_input").on("update", function(cmp) {
        sheet.equipage.miniManoeuvre.set(+(cmp.value() as string))
    })

    sheet.find("equipe_maxi_input").on("update", function(cmp) {
        sheet.equipage.maxi.set(+(cmp.value() as string))
    })

    sheet.find("equipe_actuel_input").on("update", function(cmp) {
        sheet.equipage.actuel.set(+(cmp.value() as string))
    })
}