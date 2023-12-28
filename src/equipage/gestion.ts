import { gestion } from "../globals"
import { effect, intToWord, setVirtualBg, setVirtualColorFromSignal, signal } from "../utils/utils"

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

const setupRoll = function(sheet: NavireSheet, title: string, eff: Component, fac: Component) {
    return function() {
        let dice = "10"
        if(eff.value()<=0) {
            dice = "12"
        }
        new RollBuilder(sheet.raw()).title(title).expression("(" + eff.value() + "d" + dice + " <={1:2} " + fac.value() + ")[eff_" + intToWord(eff.value()) + ",fac_" + intToWord(fac.value()) + "]").roll()
        eff.virtualValue(eff.rawValue())
        setVirtualBg(eff as Component<number>)
        fac.virtualValue(fac.rawValue())
        setVirtualBg(fac as Component<number>)
    }
}

export const setupGestionSignalUpdates = function(sheet: NavireSheet) {
    each(gestion, function(comps, poste) {
        for(let i=0; i<comps.length; i++) {
            sheet.find(poste + "_" + comps[i] + "_val").on("update", setSignal(sheet, poste, comps[i], "efficacite"))
            sheet.find(poste + "_" + comps[i] + "_fac").on("update", setSignal(sheet, poste, comps[i], "facilite"))

            sheet.find(poste + "_" + comps[i] + "_roll").on("click", setupRoll(sheet, sheet.find(poste + "_" + comps[i] + "_roll").text(), sheet.find(poste + "_" + comps[i] + "_val"), sheet.find(poste + "_" + comps[i] + "_fac")))
            sheet.find(poste + "_" + comps[i] + "_plus").on("click", setVirtualValue(sheet, poste, comps[i], "efficacite", 1))
            sheet.find(poste + "_" + comps[i] + "_min").on("click", setVirtualValue(sheet, poste, comps[i], "efficacite", -1))
            sheet.find(poste + "_" + comps[i] + "_fac_plus").on("click", setVirtualValue(sheet, poste, comps[i], "facilite", 1))
            sheet.find(poste + "_" + comps[i] + "_fac_min").on("click", setVirtualValue(sheet, poste, comps[i], "efficacite", -1))
        }
    })
}

const setSignal = function(sheet: NavireSheet, poste: string, comp: string, typ: "efficacite" | "facilite") {
    return function(cmp: Component) {
        sheet.feuilleEquipage.gestion[poste][comp][typ].set(cmp.value() as number)
    }
}

const setVirtualValue = function(sheet: NavireSheet, poste: string, comp: string, typ: "efficacite" | "facilite", delta: number) {
    const suffix = typ === "efficacite" ? "val" : "fac"
    return function() {
        const valCmp = sheet.find(poste + "_" + comp + "_" + suffix)
        valCmp.virtualValue(parseInt(valCmp.value() as string) + delta)
        setVirtualBg(valCmp as Component<number>)
    }
}