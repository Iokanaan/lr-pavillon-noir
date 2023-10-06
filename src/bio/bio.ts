import { effect, signal } from "../utils/utils"

export const setupAvantageEditEntry = function(entry: Component<Avantage>) {

    if(entry.find("avantage_choice").value() === undefined) {
        entry.find("avantage_choice").value("animal_compagnie")
    }
    if(entry.find("avantage_input").value() === "") {
        entry.find("avantage_input").value(entry.find("avantage_choice").text())
    }
    entry.find("avantage_choice").on("update", function(cmp) {
        entry.find("avantage_input").value(cmp.text())
    })
    entry.find("custom_avantage").on("click", function() {
        if(entry.find("avantage_choice").visible()) {
            entry.find("avantage_choice").hide()
            entry.find("avantage_input").show()
        } else {
            entry.find("avantage_choice").show()
            entry.find("avantage_input").hide()
        }
    })
}

export const setupFaiblesseEditEntry = function(entry: Component<Avantage>) {
    if(entry.find("desavantage_choice").value() === undefined) {
        entry.find("desavantage_choice").value("borgne")
    }
    if(entry.find("desavantage_input").value() === "") {
        entry.find("desavantage_input").value(entry.find("desavantage_choice").text())
    }
    entry.find("desavantage_choice").on("update", function(cmp) {
        entry.find("desavantage_input").value(cmp.text())
    })
    entry.find("custom_desavantage").on("click", function() {
        if(entry.find("desavantage_choice").visible()) {
            entry.find("desavantage_choice").hide()
            entry.find("desavantage_input").show()
        } else {
            entry.find("desavantage_choice").show()
            entry.find("desavantage_input").hide()
        }
    })
}


export const setupTitre = function(sheet: PavillonSheet) {

    sheet.find("add_titre").on("click", function() {
        if(sheet.find("titre_row").visible() || sheet.find("no_titre").visible()) {
            sheet.find("titre_row").hide()
            sheet.find("no_titre").hide()
            sheet.find("change_titre_row").show()
        } else {
            if(sheet.titre() !== "" && sheet.titre() !== undefined) {
                sheet.find("titre_row").show()
            } else {
                sheet.find("no_titre").show()
            }
            sheet.find("change_titre_row").hide()
        }
    })
    sheet.find("titre_input").on("update", function(cmp) {
        sheet.titre.set(cmp.value() as string)
    })

    effect(function() {
        if(sheet.titre() === "" || sheet.titre() === undefined) {
            sheet.find("titre_row").hide()
            sheet.find("no_titre").show()
            sheet.find("change_titre_row").hide()
        } else {
            sheet.find("titre_row").show()
            sheet.find("no_titre").hide()
            sheet.find("change_titre_row").hide()
        }
    }, [sheet.titre])
}

export const setupReligion = function(sheet: PavillonSheet) {
    sheet.find("religion_title").on("click", function() {
        if(sheet.find("religion_row").visible()) {
            sheet.find("religion_row").hide()
            sheet.find("religion_change_row").show()
        } else {
            sheet.find("religion_row").show()
            sheet.find("religion_change_row").hide()
        }
    })

    sheet.find("religion_input").on("update", function(cmp) {
        sheet.religion.set(cmp.value() as string)
    })
    
    effect(function() {
        if(sheet.religion() !== undefined && sheet.religion() !== "") {
            sheet.find("religion_label").value(sheet.religion())
            sheet.find("religion_row").show()
            sheet.find("religion_change_row").hide()
        } else {
            sheet.find("religion_row").hide()
            sheet.find("religion_change_row").show()
        }
    },[sheet.religion])
}

export const setupBaseDescription = function(sheet: PavillonSheet, type: "taille" | "age" | "poids") {
    sheet.find(type + "_title").on("click", function() {
        if(sheet.find(type + "_label").visible()) {
            sheet.find(type + "_label").hide()
            sheet.find(type + "_input").show()
        } else {
            sheet.find(type + "_label").show()
            sheet.find(type + "_input").hide()
        }
    })

    sheet.find(type + "_input").on("update", function(cmp) {
        if(/^[0-9]*$/.test(cmp.value() as string)) {
            sheet[type].set(parseInt(cmp.value() as string))
        }
    })

    effect(function() {
        sheet.find(type + "_label").value(sheet[type]())
        sheet.find(type + "_label").show()
        sheet.find(type + "_input").hide()
    }, [sheet[type]])
}

export const setupOrigine = function(sheet: PavillonSheet) {
    sheet.find("change_origine_sociale").on("click", function() {
        if(sheet.find("origine_sociale_label").visible()) {
            sheet.find("origine_sociale_choice").show()
            sheet.find("custom_origine_sociale").show()
            sheet.find("origine_sociale_label").hide()
        }
    })
    sheet.find("custom_origine_sociale").on("click", function() {
        if(sheet.find("origine_sociale_choice").visible()) {
            sheet.find("origine_sociale_choice").hide()
            sheet.find("origine_sociale_input").show()
        } else {
            sheet.find("origine_sociale_choice").show()
            sheet.find("origine_sociale_input").hide()
        }
    })
    sheet.find("origine_sociale_choice").on("update", function(cmp) {
        sheet.find("origine_sociale_input").value(cmp.text())
    })
    sheet.find("origine_sociale_input").on("update", function(cmp) {
        sheet.find("origine_sociale_label").value(cmp.value())
        sheet.find("custom_origine_sociale").hide()
        sheet.find("origine_sociale_choice").hide()
        sheet.find("origine_sociale_input").hide()
        sheet.find("origine_sociale_label").show()
    })

}

export const setupJeunesse = function(sheet: PavillonSheet, num: number) {
    sheet.find("change_jeunesse_" + num).on("click", function() {
        if(sheet.find("jeunesse_label_" + num).visible()) {
            sheet.find("jeunesse_choice_" + num).show()
            sheet.find("custom_jeunesse_" + num).show()
            sheet.find("jeunesse_label_" + num).hide()
        }
    })
    sheet.find("custom_jeunesse_" + num).on("click", function() {
        if(sheet.find("jeunesse_choice_" + num).visible()) {
            sheet.find("jeunesse_choice_" + num).hide()
            sheet.find("jeunesse_input_" + num).show()
        } else {
            sheet.find("jeunesse_choice_" + num).show()
            sheet.find("jeunesse_input_" + num).hide()
        }
    })
    sheet.find("jeunesse_choice_" + num).on("update", function(cmp) {
        sheet.find("jeunesse_input_" + num).value(cmp.text())
    })
    sheet.find("jeunesse_input_" + num).on("update", function(cmp) {
        sheet.find("jeunesse_label_" + num).value(cmp.value())
        sheet.find("custom_jeunesse_" + num).hide()
        sheet.find("jeunesse_choice_" + num).hide()
        sheet.find("jeunesse_input_" + num).hide()
        sheet.find("jeunesse_label_" + num).show()
    })

}

export const setupPeuple = function(sheet: PavillonSheet) {

    sheet.find("change_peuple").on("click", function() {
        if(sheet.find("origine_row").visible()) {
            sheet.find("origine_row").hide()
            sheet.find("origine_change_row").show()
            sheet.find("record_peuple").show()
        } else {
            sheet.find("origine_row").show()
            sheet.find("origine_change_row").hide()
            sheet.find("record_peuple").hide()
        }
    })

    sheet.find("record_peuple").on("click", function() {
        sheet.origine.set({
            id: sheet.find("peuple_choice").value() as string,
            peuple: sheet.find("peuple_input").value() as string,
            groupe: sheet.find("peuple_groupe_input").value() as string
        })
    })

    effect(function() {
        if(sheet.origine().peuple !== undefined && sheet.origine().peuple !== "") {
            sheet.find("origine_row").show()
            sheet.find("origine_change_row").hide()
            sheet.find("record_peuple").hide()
            if(sheet.origine().groupe !== "") {
                sheet.find("peuple_label").value(sheet.origine().peuple + ' (' + sheet.origine().groupe + ')')
            } else {
                sheet.find("peuple_label").value(sheet.origine().peuple)
            }
        } else {
            sheet.find("origine_row").hide()
            sheet.find("origine_change_row").show()
            sheet.find("record_peuple").show()
        }
    }, [sheet.origine])

    sheet.find("peuple_choice").on("update", function(cmp) {
        sheet.find("peuple_input").value(cmp.text())
    })

    sheet.find("custom_peuple").on("click", function() {
        if(sheet.find("peuple_choice").visible()) {
            sheet.find("peuple_choice").hide()
            sheet.find("peuple_input").show()
            sheet.find("peuple_choice").value(null)
        } else {
            sheet.find("peuple_input").hide()
            sheet.find("peuple_choice").show()
        }
    })
}

const professionToChoice = function(professions: ProfessionEntity[]) {
    const choices: Record<string, string> = {}
    for(let i=0; i<professions.length; i++) {
        choices[professions[i].id] = professions[i].name
    }
    return choices
}

const getSignals = function(sheet: PavillonSheet, typeMetier: "profession" | "poste_bord") {
    if(typeMetier === "poste_bord") {
        return [sheet.posteBord.profession]
    }
    const professionSignals: Signal<Profession | undefined>[] = []
    for(let i=0; i<sheet.professions.length; i++) {
        professionSignals.push(sheet.professions[i].profession)
    }
    log(professionSignals)
    return professionSignals
}

const getTable = function(typeMetier: "profession" | "poste_bord") {
    if(typeMetier === "poste_bord") {
        return "postes_bord"
    }
    return "professions"
}

export const setupProfession = function(sheet: PavillonSheet, typeMetier: "profession" | "poste_bord", qte: number) {

    const professionSignals = getSignals(sheet, typeMetier)

    sheet.find("add_" + typeMetier).on("click", function() {
        let availableNum = 0
        for(let i=0;i<qte;i++) {
            if(professionSignals[i]() === undefined) {
                availableNum = i + 1
                break
            }
        }
        if(availableNum !== 0) {
            sheet.find("change_" + typeMetier + "_" + availableNum +  "_row").show()
        }
        log(availableNum)
    })

    effect(function() {
        let noMetier = true
        for(let i=0; i<qte; i++) {
            noMetier = noMetier && (professionSignals[i]() === undefined) 
        }
        if(noMetier) {
            sheet.find("no_" + typeMetier).show()
        } else {
            sheet.find("no_" + typeMetier).hide()
        }
    }, professionSignals)
    
    const metierTable = getTable(typeMetier)
    const professionByType: Record<string, ProfessionEntity[]> = {};
    
    (Tables.get("types_" + metierTable) as Table<ProfessionEntity>).each(function(val) {
        professionByType[val.id] = []
    });
    Tables.get(metierTable).each(function(val) {
        professionByType[val.type].push(val)
    });

    for(let i=1; i<=qte; i++) {
        setupSingleProfession(sheet, professionByType, typeMetier, i)
    }

}

const setupSingleProfession = function(
    sheet: PavillonSheet, 
    professionByType: Record<string, ProfessionEntity[]>, 
    typeMetier: "profession" | "poste_bord", 
    num: number
    ) {

    const professionRow = sheet.find(typeMetier + "_" + num + "_row") as Component<null>
    const changeProfessionRow = sheet.find("change_" + typeMetier + "_" + num + "_row") as Component<null>
    const metierChoiceCmp = sheet.find(typeMetier + "_choice_" + num) as ChoiceComponent<string>
    const categoryChoiceCmp = sheet.find("type_" + typeMetier + "_choice_" + num) as ChoiceComponent<string>
    const metierInputCmp = sheet.find(typeMetier + "_input_" + num) as Component<string>
    const removeCmp = sheet.find("remove_" + typeMetier + "_" + num) as Component<string>
    const metierLabelCmp = sheet.find(typeMetier + "_label_" + num) as Component<string>
    const attr1Cmp = sheet.find("attr_1_" + typeMetier + "_" + num) as Component<AttributEnum>
    const attr2Cmp = sheet.find("attr_2_" + typeMetier + "_" + num) as Component<AttributEnum>
    
    if(categoryChoiceCmp.value() === undefined) {
        categoryChoiceCmp.value(Object.keys(professionByType)[0])
    }

    const metierChoices = professionToChoice(professionByType[categoryChoiceCmp.value()])
    metierChoiceCmp.setChoices(metierChoices)
    if(metierChoices[metierChoiceCmp.value()] === undefined) {
        metierChoiceCmp.value(Object.keys(metierChoices)[0])
    }

    const selectedProfession = signal(Tables.get(getTable(typeMetier)).get(metierChoiceCmp.value()))

    // Mise à jour de la catégorie : on change les métiers de la liste
    categoryChoiceCmp.on("update", function(cmp) {
        const professionChoices = professionToChoice(professionByType[cmp.value()]);
        metierChoiceCmp.setChoices(professionChoices)
        metierChoiceCmp.value(Object.keys(professionChoices)[0])
    })

    // Mise à jour du métier, on met à jour la profession sélectionnée
    metierChoiceCmp.on("update", function(cmp) {
        selectedProfession.set(Tables.get(getTable(typeMetier)).get(cmp.value()))
    })

    // Inscription du métier de la liste dans l'input
    effect(function() {
        metierInputCmp.value(_(selectedProfession().name))
    }, [selectedProfession])
    
    const professionSignal = getSignals(sheet, typeMetier)[num - 1]
    
    // Suppression d'un élément : on retire la profession de la feuille
    removeCmp.on("click", function() {
        professionSignal.set(undefined)
    })

    // Affichage de la profession enregistrée
    effect(function() {
        const profession = professionSignal()
        if(profession === undefined) {
            professionRow.hide()
            metierLabelCmp.value("")
            metierInputCmp.value("")
        } else {
            professionRow.show()
            metierLabelCmp.value(profession.name)
            attr1Cmp.value(profession.attr_1)
            attr2Cmp.value(profession.attr_2)
        }
    }, [professionSignal])

    // Validation d'un élément, on ajoute la profession de la feuille
    sheet.find("record_" + typeMetier + "_" + num).on("click", function() {
        professionSignal.set({
            name: metierInputCmp.value(),
            attr_1: attr1Cmp.value(),
            attr_2: attr2Cmp.value(),
        })
        changeProfessionRow.hide()
    })

    // Changement d'affichage pour métier custom
    sheet.find("custom_" + typeMetier + "_" + num).on("click", function() {
        if(sheet.find(typeMetier + "_" + num + "_list_col").visible()) {
            sheet.find(typeMetier + "_" + num + "_custom_col").show()
            sheet.find(typeMetier + "_" + num + "_list_col").hide()
        } else {
            sheet.find(typeMetier + "_" + num + "_custom_col").hide()
            sheet.find(typeMetier + "_" + num + "_list_col").show()
        }
    })
}