import { mapLocalisation } from "../utils/mappers"
import { computed, effect, signal } from "../utils/utils"

export const setupDisplayedBlessures = function(sheet: PavillonSheet) {
    effect(function() {
        const localisations = ["tete","torse","bd","bg","jd","jg"]
        const res = sheet.attr['RES']()
        for(let loc=0;loc<localisations.length;loc++) {
            for(let i=1;i<=11;i++) {
                if(i<=res+2) {
                    sheet.find("blessure_" + localisations[loc] + "_"  + i).show()
                } else {
                    sheet.find("blessure_" + localisations[loc] + "_"  + i).hide()
                }
            }
            if(res <= 4) {
                sheet.find("blessures_" + localisations[loc] + "_legeres").hide()
            } else {
                sheet.find("blessures_" + localisations[loc] + "_legeres").show()
            }
            if(res <=3) {
                sheet.find("blessures_" + localisations[loc] + "_serieuses").hide()
            } else {
                sheet.find("blessures_" + localisations[loc] + "_serieuses").show()
            }
            if(res <=2) {
                sheet.find("blessures_" + localisations[loc] + "_graves").hide()
            } else {
                sheet.find("blessures_" + localisations[loc] + "_graves").show()
            }
        }
    }, [sheet.attr['RES']]);


    (["tete", "torse", "bg", "bd", "jg", "jd"] as LocalisationShortEnum[]).forEach(function(loc) {
        sheet.find("blessure_" + loc + "_1").on("update", function(cmp) { sheet.blessures.localisation[loc].detail.mort[0].set(cmp.value() as boolean) })
        sheet.find("blessure_" + loc + "_2").on("update", function(cmp) { sheet.blessures.localisation[loc].detail.coma[0].set(cmp.value() as boolean) })
        sheet.find("blessure_" + loc + "_3").on("update", function(cmp) { sheet.blessures.localisation[loc].detail.coma[1].set(cmp.value() as boolean) })
        sheet.find("blessure_" + loc + "_4").on("update", function(cmp) {sheet.blessures.localisation[loc].detail.critique[0].set(cmp.value() as boolean) })
        sheet.find("blessure_" + loc + "_11").on("update", function(cmp) { sheet.blessures.localisation[loc].detail.critique[1].set(cmp.value() as boolean) })
        sheet.find("blessure_" + loc + "_5").on("update", function(cmp) { sheet.blessures.localisation[loc].detail.grave[0].set(cmp.value() as boolean) })
        sheet.find("blessure_" + loc + "_10").on("update", function(cmp) { sheet.blessures.localisation[loc].detail.grave[1].set(cmp.value() as boolean) })
        sheet.find("blessure_" + loc + "_6").on("update", function(cmp) { sheet.blessures.localisation[loc].detail.serieuse[0].set(cmp.value() as boolean) })
        sheet.find("blessure_" + loc + "_9").on("update", function(cmp) { sheet.blessures.localisation[loc].detail.serieuse[1].set(cmp.value() as boolean) })
        sheet.find("blessure_" + loc + "_7").on("update", function(cmp) { sheet.blessures.localisation[loc].detail.legere[0].set(cmp.value() as boolean) })
        sheet.find("blessure_" + loc + "_8").on("update", function(cmp) { sheet.blessures.localisation[loc].detail.legere[1].set(cmp.value() as boolean) })
        const protInputCmp = sheet.find("prot_" + loc + "_input")
        const protValCmp = sheet.find("prot_" + loc + "_val")
        protValCmp.on("click", function(cmp) {
            cmp.hide()
            protInputCmp.show()
        })
        protInputCmp.on("update", function(cmp) {
            cmp.hide()
            protValCmp.show()
        })
    })

    const maxBlessuresRecord: Record<string, Computed<"legere" | "serieuse" | "grave" | "critique" | "coma" | "mort" | "aucune">> = {}
    effect(function() {
        switch(sheet.blessures.general.etat()) {
            case "mort":
                sheet.find("etat_general_label").value(_("Mort"))
                break
            case "coma":
                sheet.find("etat_general_label").value(_("Coma"))
                break
            case "critique":
                sheet.find("etat_general_label").value(_("Blessure critique"))
                break
            case "grave":
                sheet.find("etat_general_label").value(_("Gravement blessé"))
                break
            case "serieuse":
                sheet.find("etat_general_label").value(_("Sérieusement blessé"))
                break
            case "legere":
                sheet.find("etat_general_label").value(_("Légèrement blessé"))
                break
            case "aucune":
            default:
                sheet.find("etat_general_label").value(_("Indemne"))
        }
    }, [sheet.blessures.general.etat])

    effect(function() {
        if(sheet.blessures.general.malus() !== 0) {
            sheet.find("etat_general_malus").value("Malus : -" + sheet.blessures.general.malus().toString())
        } else {
            sheet.find("etat_general_malus").value("Malus : -")
        }
    }, [sheet.blessures.general.malus])
    
}

export const setupSequelles = function(sheet: PavillonSheet) {
    Tables.get("localisations").each(function(l) {
        const loc = mapLocalisation(l).code
        sheet.find('sequelles_' + loc + '_row_1').hide()
        sheet.find('sequelles_' + loc + '_row_2').hide()
        sheet.find('sequelles_' + loc + '_title').on('click', function() {
            if(sheet.find('sequelles_' + loc + '_row_1').visible()) {
                sheet.find('sequelles_' + loc + '_row_1').hide()
                sheet.find('sequelles_' + loc + '_row_2').hide()
            } else {
                sheet.find('sequelles_' + loc + '_row_1').show()
                sheet.find('sequelles_' + loc + '_row_2').show()
            }
        })
    })

} 