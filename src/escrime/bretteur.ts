import { mapEscrime } from "../utils/mappers";
import { computed, effect, signal } from "../utils/utils";

export const setupBretteurName = function(sheet: PavillonSheet)  {
    sheet.find("nom_bretteur_label").on("click", function() {
        if(sheet.find("nom_bretteur_val").visible()) {
            sheet.find("nom_bretteur_val").hide()
            sheet.find("nom_bretteur_input").show()
        } else {
            sheet.find("nom_bretteur_val").show()
            sheet.find("nom_bretteur_input").hide()
        }
    })
    sheet.find("nom_bretteur_input").on("update", function() {
        sheet.find("nom_bretteur_val").show()
        sheet.find("nom_bretteur_input").hide()
    })
}

export const setupCompEscrimeDisplayEntry = function(entry: Component<EscrimeData>) {
    const compEscrime = signal(entry.find("comp_escrime_val").value())
    const ptsEscrime = computed(function() {
        const bonus = entry.value().predilection ? 1 : 0
        let total = 0
        for(let i=1;i<=compEscrime();i++) {
            total += i + bonus;
        }
        return total
    }, [compEscrime])
    entry.find("comp_escrime_val").on("update", function(cmp) {
        compEscrime.set(cmp.value())
    })
    effect(function() {
        entry.find("pts_escrime_val").value(ptsEscrime())
    }, [ptsEscrime])

    const oppCmps = [
        { "col": entry.find("opp_1_col"), "container" : entry.find("opp_1_container"), "checkbox": entry.find("opp_1_selected")},
        { "col": entry.find("opp_2_col"), "container" : entry.find("opp_2_container"), "checkbox": entry.find("opp_2_selected")},
        { "col": entry.find("opp_3_col"), "container" : entry.find("opp_3_container"), "checkbox": entry.find("opp_3_selected")},
        { "col": entry.find("opp_4_col"), "container" : entry.find("opp_4_container"), "checkbox": entry.find("opp_4_selected")},
        { "col": entry.find("opp_5_col"), "container" : entry.find("opp_5_container"), "checkbox": entry.find("opp_5_selected")},
        { "col": entry.find("opp_6_col"), "container" : entry.find("opp_6_container"), "checkbox": entry.find("opp_6_selected")},
        { "col": entry.find("opp_7_col"), "container" : entry.find("opp_7_container"), "checkbox": entry.find("opp_7_selected")},
        { "col": entry.find("opp_8_col"), "container" : entry.find("opp_8_container"), "checkbox": entry.find("opp_8_selected")},
        { "col": entry.find("opp_9_col"), "container" : entry.find("opp_9_container"), "checkbox": entry.find("opp_9_selected")},
        { "col": entry.find("opp_10_col"), "container" : entry.find("opp_10_container"), "checkbox": entry.find("opp_10_selected")},
    ]
    const changeOpacity = function(i: number) {
        return function(cmp: Component<boolean>) {
            if(cmp.value()) {
                oppCmps[i].container.removeClass("opacity-50")
            } else {
                oppCmps[i].container.addClass("opacity-50")
            }
        }
    }
    const updateCheckbox = function(i: number) {
        return function() {
            oppCmps[i].checkbox.value(!oppCmps[i].checkbox.value())
        }
    }
    for(let i=0;i<oppCmps.length;i++) {
        const opp = "opp_" + (i+1)
        if(entry.value()[opp] as boolean) {
            oppCmps[i].col.show()
        } else {
            oppCmps[i].col.hide()
        }
        if(oppCmps[i].checkbox.value()) {
            oppCmps[i].container.removeClass("opacity-50")
        } else {
            oppCmps[i].container.addClass("opacity-50")
        }
        oppCmps[i].container.on("click", updateCheckbox(i))
        oppCmps[i].checkbox.on("update", changeOpacity(i))
    }
}



export const setupCompEscrimeEditEntry = function(entry: Component) {
    
    const escrimeChoiceCmp = entry.find("comp_escrime_choice");
    const escrimeInputCmp = entry.find("comp_escrime_input");
    const customModeCmp = entry.find("custom_mode")
    const customDisplayCmp = entry.find("display_custom")
    const listDisplayCmp = entry.find("display_predef")
    const customCol = entry.find("custom_col")
    const predefCol = entry.find("predef_col")
    
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

    customModeCmp.on("update", function(cmp) {
        customMode.set(cmp.value())
    })

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

    customDisplayCmp.on("click", function() {
        customModeCmp.value(true)
    })

    listDisplayCmp.on("click", function() {
        customModeCmp.value(false)
    })

}