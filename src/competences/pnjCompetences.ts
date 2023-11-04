import { globalPnjSheets, globalSheets } from "../globals";
import { mapCompetencePnj } from "../utils/mappers";
import { effect, setVirtualBg, signal } from "../utils/utils";

export const setupCompetenceEditEntry = function(entry: Component) {

    const compByType: Record<string, CompetencePnj[]> = {};
    Tables.get("types_comp").each(function(val) {
        compByType[val.id] = []
    })
    Tables.get("comp_pnj").each(function(val) {
        compByType[val.category].push(val)
    })

    const typeCompCmp = entry.find("types_comp_choice") as ChoiceComponent<string>
    const compCmpChoice = entry.find("comp_choice") as ChoiceComponent<string>
    const compCmp = entry.find("comp") as Component<string>
    const metierCmp = entry.find("metier") as Component<boolean>
    const customDisplay = entry.find("display_custom") as Component<string>
    const listDisplay = entry.find("display_predef") as Component<string>
    const customModeCmp = entry.find("custom_mode") as Component<boolean>
    const listCol = entry.find("predef_col") as Component<null>
    const customCol = entry.find("custom_col") as Component<null>

    if(typeCompCmp.value() === null || typeCompCmp.value() === undefined) {
        typeCompCmp.value(Object.keys(compByType)[0])
    }

    if(compCmpChoice.value() === null || compCmpChoice.value() === undefined) {
        compCmpChoice.value(compByType[typeCompCmp.value()][0].id)
    }

    const selectedType = signal(typeCompCmp.value())
    const selectedComp = signal(Tables.get("comp_pnj").get(compCmpChoice.value()))
    const customMode = signal(customModeCmp.value())


    // Mise à jour de la sous-liste
    effect(function() {
        const choices = compToChoice(compByType[selectedType()])
        compCmpChoice.setChoices(choices)
        compCmpChoice.value(Object.keys(choices)[0])
    }, [selectedType])

    typeCompCmp.on("update", function(cmp) {
        selectedType.set(cmp.value())
    })

    compCmpChoice.on("update", function(cmp) {
        selectedComp.set(mapCompetencePnj(Tables.get("comp_pnj").get(cmp.value())))
    })

    // Affichage soit du mode liste soit du mode personnalisé
    effect(function() {
        if(customMode()) {
            listCol.hide()
            customCol.show()
            customDisplay.hide()
            listDisplay.show()
        } else {
            listCol.show()
            customCol.hide()
            customDisplay.show()
            listDisplay.hide()
        }
    }, [customMode])

    // En mode liste, mise à jour de l'input
    effect(function() {
        if(!customMode()) {
            compCmp.value(selectedComp().name)
            if(selectedComp().metier !== metierCmp.value()) {
                metierCmp.value(selectedComp().metier)
            }
        }
    }, [selectedComp, customMode])

    customDisplay.on("click", function() {
        customMode.set(true)
    })

    listDisplay.on("click", function() {
        customMode.set(false)
    })
}


const compToChoice = function(competences: CompetencePnj[]) {
    const choices: Record<string, string> = {}
    for(let i=0; i<competences.length; i++) {
        choices[competences[i].id] = competences[i].name
    }
    return choices
}

export const setupCompetenceDisplayEntry = function(entry: Component<CompPnjData>) {

    const repeater = entry.sheet().get("competences_repeater") as Component<Record<string, CompPnjData>>

    const labelCmp = entry.find("comp_label")
    const sheet = globalPnjSheets[entry.sheet().getSheetId()]

    labelCmp.on("click", function(cmp) {
        const selectedComp = sheet.selectedComp()
        if(selectedComp === undefined || selectedComp.id !== entry.id()) {
            sheet.selectedComp.set({name:cmp.text(), id:entry.id(), category: "", metier: entry.value().metier})
        } else {
            sheet.selectedComp.set(undefined)
        }
    })

    const compValCmp = entry.find("comp_val") as Component<number>
    if(compValCmp.value() === undefined || compValCmp.value() === null) {
        compValCmp.value(0)
    }

    const virtualModifier = signal(0)

    // Système de modificateurs +/-
    entry.find("comp_plus").on("click", function() {
        virtualModifier.set(virtualModifier() + 1)
    })
    
    entry.find("comp_minus").on("click", function() {
        virtualModifier.set(virtualModifier() - 1)
    })

    effect(function() {
        if(virtualModifier() < 0) {
            entry.find("sign").hide()
            entry.find("modifier").show()
        } else if(virtualModifier() > 0) {
            entry.find("sign").show()
            entry.find("modifier").show()
        } else {
            entry.find("sign").hide()
            entry.find("modifier").hide()
        }
        entry.find("modifier").text(virtualModifier().toString())
    }, [virtualModifier]) 

    // Effet de surlignage quand une compétence est sélectionnée
    effect(function() {
        const selectedComp = sheet.selectedComp()
        if(selectedComp !== undefined && entry.id() === selectedComp.id) {
            labelCmp.addClass("text-info") 
        } else {
            labelCmp.removeClass("text-info") 
        }
        if(selectedComp === undefined) {
            virtualModifier.set(0)
        }
    }, [sheet.selectedComp])

}
