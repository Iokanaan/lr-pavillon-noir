import { mapEscrime } from "../utils/mappers";
import { computed, effect, signal } from "../utils/utils";

export const setupBretteurName = function(sheet: PavillonSheet)  {
    
    // Définition des composants
    const bretteurLabelCmp = sheet.find("nom_bretteur_label") as Component<string>
    const bretteurInputCmp = sheet.find("nom_bretteur_input") as Component<string>
    const bretteurValCmp = sheet.find("nom_bretteur_val") as Component<string>

    // Affichage du mode édition
    bretteurLabelCmp.on("click", function() {
        if(bretteurValCmp.visible()) {
            bretteurValCmp.hide()
            bretteurInputCmp.show()
        } else {
            bretteurValCmp.show()
            bretteurInputCmp.hide()
        }
    })

    // Retour au mode affichage à la mise à jour
    bretteurInputCmp.on("update", function(cmp) {
        bretteurValCmp.show()
        cmp.hide()
    })
}

// Définition du composant d'affichage d'une compétence d'escrime
export const setupCompEscrimeDisplayEntry = function(entry: Component<EscrimeData>) {

    // Définition des composants
    const compEscrimeCmp = entry.find("comp_escrime_val") as Component<number>
    const ptsEscrimeCmp = entry.find("pts_escrime_val") as Component<string>
    const oppCmps: { col: Component<null>, container: Component<null>, checkbox: Component<boolean>, label: Component<string>}[] = [
        { "col": entry.find("opp_1_col"), "container" : entry.find("opp_1_container"), "checkbox": entry.find("opp_1_selected"), "label": entry.find("opp_1_label")},
        { "col": entry.find("opp_2_col"), "container" : entry.find("opp_2_container"), "checkbox": entry.find("opp_2_selected"), "label": entry.find("opp_2_label")},
        { "col": entry.find("opp_3_col"), "container" : entry.find("opp_3_container"), "checkbox": entry.find("opp_3_selected"), "label": entry.find("opp_3_label")},
        { "col": entry.find("opp_4_col"), "container" : entry.find("opp_4_container"), "checkbox": entry.find("opp_4_selected"), "label": entry.find("opp_4_label")},
        { "col": entry.find("opp_5_col"), "container" : entry.find("opp_5_container"), "checkbox": entry.find("opp_5_selected"), "label": entry.find("opp_5_label")},
        { "col": entry.find("opp_6_col"), "container" : entry.find("opp_6_container"), "checkbox": entry.find("opp_6_selected"), "label": entry.find("opp_6_label")},
        { "col": entry.find("opp_7_col"), "container" : entry.find("opp_7_container"), "checkbox": entry.find("opp_7_selected"), "label": entry.find("opp_7_label")},
        { "col": entry.find("opp_8_col"), "container" : entry.find("opp_8_container"), "checkbox": entry.find("opp_8_selected"), "label": entry.find("opp_8_label")},
        { "col": entry.find("opp_9_col"), "container" : entry.find("opp_9_container"), "checkbox": entry.find("opp_9_selected"), "label": entry.find("opp_9_label")},
        { "col": entry.find("opp_10_col"), "container" : entry.find("opp_10_container"), "checkbox": entry.find("opp_10_selected"), "label": entry.find("opp_10_label")},
    ]

    // Calcul des points d'escrime
    const compEscrime = signal(compEscrimeCmp.value())
    const ptsEscrime = computed(function() {
        const bonus = entry.value().predilection ? 1 : 0
        let total = 0
        for(let i=1;i<=compEscrime();i++) {
            total += i + bonus;
        }
        return total
    }, [compEscrime])
    compEscrimeCmp.on("update", function(cmp) {
        compEscrime.set(cmp.value())
    })
    effect(function() {
        ptsEscrimeCmp.value(ptsEscrime().toString())
    }, [ptsEscrime])

    // Fonction de gestion de la sélection des opportunités connues
    const changeOpacity = function(i: number) {
        return function(cmp: Component<boolean>) {
            if(cmp.value()) {
                oppCmps[i].container.removeClass("opacity-50")
                oppCmps[i].container.addClass("bg-light")
                oppCmps[i].label.addClass("text-dark")
            } else {
                oppCmps[i].container.addClass("opacity-50")
                oppCmps[i].container.removeClass("bg-light")
                oppCmps[i].label.removeClass("text-dark")
            }
        }
    }

    // Fonction de mise à jour de la checkbox
    const updateCheckbox = function(i: number) {
        return function() {
            oppCmps[i].checkbox.value(!oppCmps[i].checkbox.value())
        }
    }


    for(let i=0;i<oppCmps.length;i++) {
        // On n'affiche que les opportunités cochées dans le mode édition
        const opp = "opp_" + (i+1)
        if(entry.value()[opp] as boolean) {
            oppCmps[i].col.show()
        } else {
            oppCmps[i].col.hide()
        }

        // Initialisation de l'opportunité avec le bon style
        if(oppCmps[i].checkbox.value()) {
            oppCmps[i].container.removeClass("opacity-50")
            oppCmps[i].container.addClass("bg-light")
            oppCmps[i].label.addClass("text-dark")
        } else {
            oppCmps[i].container.addClass("opacity-50")
            oppCmps[i].container.removeClass("bg-light")
            oppCmps[i].label.removeClass("text-dark")
        }

        // Gestion de la mise à jour des opportunités au clic
        oppCmps[i].container.on("click", updateCheckbox(i))
        oppCmps[i].checkbox.on("update", changeOpacity(i))
    }
}


export const setupCompEscrimeEditEntry = function(entry: Component) {
    
    const escrimeChoiceCmp = entry.find("comp_escrime_choice") as ChoiceComponent<string>
    const escrimeInputCmp = entry.find("comp_escrime_input") as Component<string>
    const customModeCmp = entry.find("custom_mode") as Component<boolean>
    const customDisplayCmp = entry.find("display_custom") as Component<string>
    const listDisplayCmp = entry.find("display_predef") as Component<string>
    const customCol = entry.find("custom_col") as Component<null>
    const predefCol = entry.find("predef_col") as Component<null>
    
    const oppCmps: Component<boolean>[] = [
        entry.find("opp_1"),
        entry.find("opp_2"),
        entry.find("opp_3"),
        entry.find("opp_4"),
        entry.find("opp_5"),
        entry.find("opp_6"),
        entry.find("opp_7"),
        entry.find("opp_8"),
        entry.find("opp_9"),
        entry.find("opp_10")
    ]

    // On détermine la valeur sélectionne en fonction de si on est en mode custom ou pas
    const customMode = signal(customModeCmp.value())
    let selectedVal = undefined
    if(customMode()) {
        selectedVal = escrimeInputCmp.value()
    } else {
        selectedVal = mapEscrime(Tables.get("escrimes").get(escrimeChoiceCmp.value())).id
    }

    // Signal local pour la sélection de la competence 
    const selectedEscrime = signal(selectedVal) as Signal<string>

    // Mise à jour du métier, on met à jour la profession sélectionnée
    escrimeChoiceCmp.on("update", function(cmp) {
        selectedEscrime.set(mapEscrime(Tables.get("escrimes").get(cmp.value())).id)
    })

    // Mise à jour du signal custom à l'update de la checkbox
    customModeCmp.on("update", function(cmp) {
        customMode.set(cmp.value())
    })

    // Détermine quoi afficher suivi si l'ont est en mode custom ou non
    effect(function() {
        if(customMode()) {
            predefCol.hide()
            customCol.show()
            listDisplayCmp.show()
            customDisplayCmp.hide()
        } else {
            predefCol.show()
            customCol.hide()
            listDisplayCmp.hide()
            customDisplayCmp.show()
        }
    }, [customMode])

    // Si pas en mode custom, remplir automatiquement l'input et les checkbox d'oppurtinités
    effect(function() {
        if(!customMode()) {
            const escrime = mapEscrime(Tables.get("escrimes").get(selectedEscrime()))
            escrimeInputCmp.value(escrime.name)
            let i = 0
            while(i < oppCmps.length) {
                oppCmps[i].value(escrime.opportunites.indexOf(i+1) !== -1)
                i++
            }
        }
    }, [selectedEscrime, customMode])

    // Evenement de bascule entre le mode custom et liste
    customDisplayCmp.on("click", function() {
        customModeCmp.value(true)
    })

    listDisplayCmp.on("click", function() {
        customModeCmp.value(false)
    })

}