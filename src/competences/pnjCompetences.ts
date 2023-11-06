import { globalPnjSheets } from "../globals";
import { mapCompetencePnj } from "../utils/mappers";
import { effect, signal } from "../utils/utils";

export const setupInitiative = function(sheet: PnjSheet) {
    const initiativeValCmp = sheet.find("initiative_val") as Component<string>
    const initiativeLabelCmp = sheet.find("initiative_label") as Component<string>
    initiativeLabelCmp.on("click", function() {
        new RollBuilder(sheet.raw())
            .expression(initiativeValCmp.value() + "[initiative]")
            .title(_("Initiative"))
            .roll()
    })
}

export const setupCompetenceEditEntry = function(entry: Component) {

    const compByType: Record<string, CompetencePnj[]> = {};
    Tables.get("types_comp").each(function(val) {
        compByType[val.id] = []
    })
    Tables.get("comp_pnj").each(function(val) {
        compByType[val.category].push(mapCompetencePnj(val))
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
    const degatRow = entry.find("degats_row") as Component<null>
    const attackCmp = entry.find("attaque") as Component<boolean>
    const degatsCmp = entry.find("degats") as Component<number>
    const longFeuCmp = entry.find("long_feu") as Component<boolean>
    const longFeuLabelCmp = entry.find("long_feu_label") as Component<string>

    if(degatsCmp.value() === undefined || degatsCmp.value() === null) {
        degatsCmp.value(0)
    }

    if(typeCompCmp.value() === null || typeCompCmp.value() === undefined) {
        typeCompCmp.value(Object.keys(compByType)[0])
    }

    if(compCmpChoice.value() === null || compCmpChoice.value() === undefined) {
        compCmpChoice.value(compByType[typeCompCmp.value()][0].id)
    }

    const selectedType = signal(typeCompCmp.value())
    const selectedComp = signal(mapCompetencePnj(Tables.get("comp_pnj").get(compCmpChoice.value())))
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
        longFeuCmp.value(selectedComp().feu)
        attackCmp.value(selectedComp().attaque)
    }, [selectedComp, customMode])

    if(attackCmp.value()) {
        degatRow.show()
        longFeuLabelCmp.show()
        longFeuCmp.show()
    } else {
        degatRow.hide()
        longFeuLabelCmp.hide()
        longFeuCmp.hide()
    }
    attackCmp.on("update", function(cmp) {
        if(cmp.value()) {
            degatRow.show()
            longFeuLabelCmp.show()
            longFeuCmp.show()
        } else {
            degatRow.hide()
            longFeuLabelCmp.hide()
            longFeuCmp.hide()
        }
    })

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

    const labelCmp = entry.find("comp_label") as Component<string>
    const compPlusCmp = entry.find("comp_plus") as Component<string>
    const compMinCmp = entry.find("comp_minus") as Component<string>
    const signCmp = entry.find("sign") as Component<string>
    const modifierCmp = entry.find("modifier") as Component<string>
    const longFeuPlusCmp = entry.find("long_feu_plus") as Component<string>
    const longFeuMinCmp = entry.find("long_feu_minus") as Component<string>
    const degatsPlusCmp = entry.find("degats_plus") as Component<string>
    const degatsMinCmp = entry.find("degats_minus") as Component<string>
    const longFeuIcon = entry.find("long_feu_icone") as Component<string>
    const degatsIcon = entry.find("degats_icone") as Component<string>
    const longFeuVal = entry.find("long_feu_val") as Component<string>
    const degatsVal = entry.find("degats_val") as Component<string>

    const sheet = globalPnjSheets[entry.sheet().getSheetId()]

    // Fonction de sélection de la compétence au clic
    labelCmp.on("click", function(cmp) {
        const selectedComp = sheet.selectedComp()
        if(selectedComp === undefined || selectedComp.id !== entry.id()) {
            log("select comp")
            sheet.selectedComp.set({
                name:cmp.text(), 
                id:entry.id(), 
                category: "", 
                metier: entry.value().metier, 
                attaque: entry.value().attaque, 
                feu: entry.value().long_feu
            })
        } else {
            log("select undef")
            sheet.selectedComp.set(undefined)
        }
    })

    const compValCmp = entry.find("comp_val") as Component<number>
    const compValSignal = signal(compValCmp.value())
    if(compValCmp.value() === undefined || compValCmp.value() === null) {
        compValCmp.value(0)
    }

    compValCmp.on("update", function(cmp) {
        compValSignal.set(cmp.value())
    })

    const virtualModifier = signal(0)

    // Système de modificateurs +/-
    compPlusCmp.on("click", function() {
        virtualModifier.set(virtualModifier() + 1)
    })
    
    compMinCmp.on("click", function() {
        virtualModifier.set(virtualModifier() - 1)
    })

    // Contournement du mode principale : les virtualValue ne fonctionnent pas dans un repeater
    effect(function() {
        if(virtualModifier() < 0) {
            signCmp.hide()
            modifierCmp.show()
        } else if(virtualModifier() > 0) {
            signCmp.show()
            modifierCmp.show()
        } else {
            signCmp.hide()
            modifierCmp.hide()
        }
        modifierCmp.text(virtualModifier().toString())
    }, [virtualModifier]) 

    const virtualLongFeuModifier = signal(0)

    // Système de modificateurs +/-
    longFeuPlusCmp.on("click", function() {
        virtualLongFeuModifier.set(virtualLongFeuModifier() + 1)
    })
    
    longFeuMinCmp.on("click", function() {
        virtualLongFeuModifier.set(virtualLongFeuModifier() - 1)
    })

    effect(function() {
        longFeuVal.value((4 - virtualModifier() + virtualLongFeuModifier() - compValSignal()).toString())
        setVirtualColorReverse(longFeuVal, 4 - compValSignal())
    }, [virtualLongFeuModifier, virtualModifier, compValSignal]) 

    const virtualDegatsModifier = signal(0)

    // Système de modificateurs +/-
    degatsPlusCmp.on("click", function() {
        virtualDegatsModifier.set(virtualDegatsModifier() + 1)
    })
    
    degatsMinCmp.on("click", function() {
        virtualDegatsModifier.set(virtualDegatsModifier() - 1)
    })

    effect(function() {
        degatsVal.value((entry.value().degats + virtualDegatsModifier()).toString())
        setVirtualColor(degatsVal, entry.value().degats)
    }, [virtualDegatsModifier]) 

    if(entry.value().attaque) {
        degatsIcon.show()
        degatsVal.show()
        degatsPlusCmp.show()
        degatsMinCmp.show()
        if(entry.value().long_feu) {
            longFeuIcon.show()
            longFeuVal.show()
            longFeuPlusCmp.show()
            longFeuMinCmp.show()
        } else {
            longFeuIcon.hide()
            longFeuVal.hide()
            longFeuPlusCmp.hide()
            longFeuMinCmp.hide()
        }
    } else {
        degatsIcon.hide()
        degatsVal.hide()
        longFeuIcon.hide()
        longFeuVal.hide()
        longFeuPlusCmp.hide()
        longFeuMinCmp.hide()
        degatsPlusCmp.hide()
        degatsMinCmp.hide()
    }

    // Effet de surlignage quand une compétence est sélectionnée
    effect(function() {
        const selectedComp = sheet.selectedComp()
        if(selectedComp !== undefined && entry.id() === selectedComp.id) {
            entry.find("comp_label").addClass("text-info") 
        } else {
            entry.find("comp_label").removeClass("text-info") 
        }
        if(selectedComp === undefined) {
            virtualModifier.set(0)
        }
    }, [sheet.selectedComp])

}

const setVirtualColor = function(cmp: Component<string>, refValue: number) {
    if(parseInt(cmp.value()) > refValue) {
        cmp.addClass("text-success")
        cmp.removeClass("text-danger")
    } else if(parseInt(cmp.value()) < refValue) {
        cmp.removeClass("text-success")
        cmp.addClass("text-danger")       
    } else {
        cmp.removeClass("text-success")
        cmp.removeClass("text-danger")
    }
}

// Fonction inverse, baisser la valeur affiche vert
const setVirtualColorReverse = function(cmp: Component<string>, refValue: number) {
    if(parseInt(cmp.value()) < refValue) {
        cmp.addClass("text-success")
        cmp.removeClass("text-danger")
    } else if(parseInt(cmp.value()) > refValue) {
        cmp.removeClass("text-success")
        cmp.addClass("text-danger")       
    } else {
        cmp.removeClass("text-success")
        cmp.removeClass("text-danger")
    }
}
