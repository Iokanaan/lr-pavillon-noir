import { gestion } from "../globals"
import { effect, intToWord, signal } from "../utils/utils"

export const selectGestionComps = function(sheet: NavireSheet) {
    const choiceCmp = sheet.find("gestion_poste_choice") as ChoiceComponent<string>
    const selectedPoste = signal(choiceCmp.value())

    choiceCmp.on("update", function(cmp) {
        selectedPoste.set(cmp.value())
    })

    const blocs: Component[] = [
        sheet.find("capitaine_comps"),
        sheet.find("pilote_comps"),
        sheet.find("calfat_comps"),
        sheet.find("charpentier_comps"),
        sheet.find("voilier_comps"),
        sheet.find("chirurgien_comps"),
        sheet.find("quartier_maitre_comps"),
        sheet.find("cambusier_comps"),
        sheet.find("grenadier_comps"),
        sheet.find("vigie_comps")
    ]
    effect(function() {
        for(let i=0; i<blocs.length; i++) {
            if(blocs[i].id() === selectedPoste() + "_comps") {
                blocs[i].show()
            } else {
                blocs[i].hide()
            }
        }
    }, [selectedPoste])
}

const setupRoll = function(sheet: NavireSheet, eff: Component, fac: Component) {
    return function() {
        let dice = "10"
        if(eff.value()<=0) {
            dice = "12"
        }
        new RollBuilder(sheet.raw()).expression("(" + eff.value() + "d" + dice + " <={1:2} " + fac.value() + ")[eff_" + intToWord(eff.value()) + ",fac_" + intToWord(fac.value()) + "]").roll()
    }
}

export const setupGestionSignalUpdates = function(sheet: NavireSheet) {
    each(gestion, function(comps, poste) {
        for(let i=0; i<comps.length; i++) {
            sheet.find(poste + "_" + comps[i] + "_val").on("update", function(cmp) {
                sheet.feuilleEquipage.gestion[poste][comps[i]]["efficacite"].set(cmp.value() as number)
            })
            sheet.find(poste + "_" + comps[i] + "_fac").on("update", function(cmp) {
                sheet.feuilleEquipage.gestion[poste][comps[i]]["facilite"].set(cmp.value() as number)
            })
            sheet.find(poste + "_" + comps[i] + "_roll").on("click", setupRoll(sheet, sheet.find(poste + "_" + comps[i] + "_val"), sheet.find(poste + "_" + comps[i] + "_fac")))
            sheet.find(poste + "_" + comps[i] + "_plus").on("click", function() {})
            sheet.find(poste + "_" + comps[i] + "_min").on("click", function() {})
            sheet.find(poste + "_" + comps[i] + "_fac_plus").on("click", function() {})
            sheet.find(poste + "_" + comps[i] + "_fac_min").on("click", function() {})
        }
    })
}