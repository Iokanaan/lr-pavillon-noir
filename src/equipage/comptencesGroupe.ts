import { effect, signal } from "../utils/utils"

export const setDetailCompetenceGroup = function(sheet: NavireSheet) {

    sheet.find("display_detail_combat").on("click", handleDisplayBloc(sheet, "combat"))
    sheet.find("display_detail_tir").on("click", handleDisplayBloc(sheet, "combat"))
    sheet.find("display_detail_manoeuvre").on("click", handleDisplayBloc(sheet, "manoeuvre"))
    sheet.find("display_detail_habilete").on("click", handleDisplayBloc(sheet, "habilete"))
    sheet.find("display_detail_ruse").on("click", handleDisplayBloc(sheet, "ruse"))
    sheet.find("display_detail_canonnade").on("click", handleDisplayBloc(sheet, "canonnade"))
    sheet.find("display_detail_recharge").on("click", handleDisplayBloc(sheet, "recharge"))

}

const handleDisplayBloc = function(sheet: NavireSheet, bloc: string) {
    return function() {
        const blocs: Record<string, Component> = {
            "combat": sheet.find("combat_detail_row"),
            "manoeuvre": sheet.find("manoeuvre_detail_row"),
            "habilete": sheet.find("habilete_detail_row"),
            "ruse": sheet.find("ruse_detail_row"),
            "canonnade": sheet.find("canonnade_detail_row"),
            "recharge": sheet.find("recharge_detail_row"),
        }
        each(blocs, function(cmp, key) {
            log(key + "=" + bloc)
            if(key === bloc) {
                cmp.show()
            } else {
                cmp.hide()
            }
        })
    }
}