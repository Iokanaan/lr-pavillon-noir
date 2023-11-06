import { mapLocalisation } from "../utils/mappers"
import { effect } from "../utils/utils"

export const setupDisplayedBlessures = function(sheet: PavillonSheet | PnjSheet) {
    // Définition du nombre de cases à afficher selon la résistance
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

    // Ajout a la feuille des blesseurs à la mise a jour des cases
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

        // Gestioin de la protection
        const protInputCmp = sheet.find("prot_" + loc + "_input") as Component<string>
        const protLabelCmp = sheet.find("prot_" + loc + "_label") as Component<string>
        const protValCmp = sheet.find("prot_" + loc + "_val") as Component<string>
        protLabelCmp.on("click", function() {
            if(protValCmp.visible()) {
                protValCmp.hide()
                protInputCmp.show()
            } else {
                protValCmp.show()
                protInputCmp.hide()
            }
        })
        protInputCmp.on("update", function() {
            protInputCmp.hide()
            protValCmp.show()
        })
    })

    // Affichage du libellé d'état général en fonction du niveau de blesssure
    effect(function() {
        const etatGeneralCmp = sheet.find("etat_general_label") as Component<string>
        switch(sheet.blessures.general.etat()) {
            case "mort":
                etatGeneralCmp.value(_("Mort"))
                break
            case "coma":
                etatGeneralCmp.value(_("Coma"))
                break
            case "critique":
                etatGeneralCmp.value(_("Blessure critique"))
                break
            case "grave":
                etatGeneralCmp.value(_("Gravement blessé"))
                break
            case "serieuse":
                etatGeneralCmp.value(_("Sérieusement blessé"))
                break
            case "legere":
                etatGeneralCmp.value(_("Légèrement blessé"))
                break
            case "aucune":
            default:
                etatGeneralCmp.value(_("Indemne"))
        }
    }, [sheet.blessures.general.etat])

    // Affichage du malus de blessure
    effect(function() {
        const etatGeneralCmp = sheet.find("etat_general_malus") as Component<string>
        if(sheet.blessures.general.malus() !== 0) {
            etatGeneralCmp.value("Malus : -" + sheet.blessures.general.malus().toString())
        } else {
            etatGeneralCmp.value("Malus : -")
        }
    }, [sheet.blessures.general.malus])
    
}

// Gestion des séquelles
export const setupSequelles = function(sheet: PavillonSheet) {
    Tables.get("localisations").each(function(l) {
        const loc = mapLocalisation(l).code
        const seqRow1 = sheet.find('sequelles_' + loc + '_row_1') as Component<null>
        const seqRow2 = sheet.find('sequelles_' + loc + '_row_2') as Component<null>
        const titleCmp = sheet.find('sequelles_' + loc + '_title') as Component<string>
        seqRow1.hide()
        seqRow2.hide()
        titleCmp.on('click', function() {
            if(seqRow1.visible()) {
                seqRow1.hide()
                seqRow2.hide()
            } else {
                seqRow1.show()
                seqRow2.show()
            }
        })
    })

} 