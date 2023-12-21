import { effect, signal } from "../utils/utils"

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