import { computed, signal } from "../utils/utils"

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
    const titre = signal(sheet.find("titre_input").value())
    sheet.find("add_titre").on("click", function() {
        sheet.find("titre_label").hide()
        sheet.find("no_titre").hide()
        sheet.find("titre_input").show()
    })
    sheet.find("titre_input").on("update", function(cmp) {
        titre.set(cmp.value())
    })
    computed(function() {
        log(titre())
        if(titre() === "") {
            sheet.find("titre_label").hide()
            sheet.find("no_titre").show()
            sheet.find("titre_input").hide()
        } else {
            sheet.find("titre_label").show()
            sheet.find("no_titre").hide()
            sheet.find("titre_input").hide()
        }
    }, [titre])
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
    const peuple = signal(sheet.find("peuple_input").value())
    const groupe = signal(sheet.find("peuple_groupe_input").value())
    sheet.find("change_peuple").on("click", function() {
        if(sheet.find("peuple_label").visible()) {
            sheet.find("peuple_input").hide()
            sheet.find("peuple_choice").show()
            sheet.find("peuple_groupe_input").show()
            sheet.find("custom_peuple").show()
            sheet.find("record_peuple").show()
            sheet.find("peuple_label").hide()
        }
    })
    sheet.find("record_peuple").on("click", function() {
        sheet.find("peuple_input").hide()
        sheet.find("peuple_choice").hide()
        sheet.find("peuple_groupe_input").hide()
        sheet.find("custom_peuple").hide()
        sheet.find("record_peuple").hide()
        sheet.find("peuple_label").show()
    })
    sheet.find("peuple_choice").on("update", function(cmp) {
        sheet.find("peuple_input").value(cmp.text())
        peuple.set(cmp.text())
    })
    sheet.find("peuple_groupe_input").on("update", function(cmp) {
        groupe.set(cmp.value())
    })
    computed(function() {
        if(groupe() !== "") {
            sheet.find("peuple_label").value(peuple() + ' (' + groupe() + ')')
        } else {
            sheet.find("peuple_label").value(peuple())
        }
    }, [peuple, groupe])
    sheet.find("custom_peuple").on("click", function() {
        if(sheet.find("peuple_choice").visible()) {
            sheet.find("peuple_choice").hide()
            sheet.find("peuple_input").show()
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

const getSignal = function(sheet: PavillonSheet, typeMetier: "profession" | "poste_bord") {
    if(typeMetier === "poste_bord") {
        return [sheet.posteBord]
    } 
    return sheet.professions
}

const getTable = function(typeMetier: "profession" | "poste_bord") {
    if(typeMetier === "poste_bord") {
        return "postes_bord"
    }
    return "professions"
}

export const setupProfession = function(sheet: PavillonSheet, typeMetier: "profession" | "poste_bord", qte: number) {
    const metierSignals = getSignal(sheet, typeMetier)
    const metierTable = getTable(typeMetier)
    const professionByType: Record<string, ProfessionEntity[]> = {};
    
    (Tables.get("types_" + metierTable) as Table<ProfessionEntity>).each(function(val) {
        professionByType[val.id] = []
    });
    Tables.get(metierTable).each(function(val) {
        professionByType[val.type].push(val)
    });

    const modes: Signal<"EDIT" | "CUSTOM" | "DISPLAY">[] = []
    
    for(let i=0;i<qte;i++) {
        modes.push(signal("DISPLAY"))
        setupSingleProfession(sheet, professionByType, typeMetier, modes[i], i+1)
    }

    sheet.find("add_" + typeMetier).on("click", function() {
        for(let i=0;i<qte;i++) {
            if(metierSignals[i]() === undefined && modes[i]() === "DISPLAY") {
                modes[i].set("EDIT")
                break
            }
        }
    })

    computed(function() {
        let noMetier = true
        for(let i=0; i<qte; i++) {
            noMetier = noMetier && (metierSignals[i]() === undefined) 
        }
        if(noMetier) {
            sheet.find("no_" + typeMetier).show()
        } else {
            sheet.find("no_" + typeMetier).hide()
        }
    }, metierSignals)
}

const setupSingleProfession = function(sheet: PavillonSheet, professionByType: Record<string, ProfessionEntity[]>, typeMetier: "profession" |"poste_bord", mode: Signal<"DISPLAY"|"EDIT"|"CUSTOM">, num: number) {

    const metierSignals = getSignal(sheet, typeMetier);

    (sheet.find("type_"+ typeMetier + "_choice_" + num) as ChoiceComponent<string>).on("update", function(cmp) {
        const professionChoices = professionToChoice(professionByType[cmp.value()]);
        (sheet.find(typeMetier + "_choice_" + num) as ChoiceComponent<string>).setChoices(professionChoices)
        sheet.find(typeMetier + "_choice_" + num).value(Object.keys(professionChoices)[0])
    });

    computed(function() {
        switch(mode()) {
            case "EDIT":
                sheet.find("no_" + typeMetier).hide()
                sheet.find("type_" + typeMetier + "_choice_" + num).show()
                sheet.find(typeMetier + "_choice_" + num).show()
                sheet.find(typeMetier + "_input_" + num).hide()
                sheet.find("attr_1_" + typeMetier + "_" + num).hide()
                sheet.find("attr_2_" + typeMetier + "_" + num).hide()
                sheet.find("custom_" + typeMetier + "_" + num).show()
                sheet.find("record_" + typeMetier + "_" + num).show()
                sheet.find(typeMetier + "_label_" + num).hide()
                sheet.find("remove_" + typeMetier + "_" + num).hide()
                break
            case "CUSTOM":
                sheet.find("type_" + typeMetier + "_choice_" + num).hide()
                sheet.find(typeMetier + "_choice_" + num).hide()
                sheet.find(typeMetier + "_input_" + num).show()
                sheet.find("attr_1_" + typeMetier + "_" + num).show()
                sheet.find("attr_2_" + typeMetier + "_" + num).show()
                sheet.find("custom_" + typeMetier + "_" + num).show()
                sheet.find("record_" + typeMetier + "_" + num).show()
                sheet.find(typeMetier + "_label_" + num).hide()
                sheet.find("remove_" + typeMetier + "_" + num).hide()
                break
            case "DISPLAY":
                sheet.find("type_" + typeMetier + "_choice_" + num).hide()
                sheet.find(typeMetier + "_choice_" + num).hide()
                sheet.find(typeMetier + "_input_" + num).hide()
                sheet.find("attr_1_" + typeMetier + "_" + num).hide()
                sheet.find("attr_2_" + typeMetier + "_" + num).hide()
                sheet.find("custom_" + typeMetier + "_" + num).hide()
                sheet.find("record_" + typeMetier + "_" + num).hide()
                sheet.find(typeMetier + "_label_" + num).show()
                log("show " + "remove_" + typeMetier + "_" + num)
                sheet.find("remove_" + typeMetier + "_" + num).show()
                break
        }
    }, [mode]);


    (sheet.find(typeMetier + "_choice_" + num) as ChoiceComponent<string>).on("update", function(cmp) {
        const selectedProfession = Tables.get(getTable(typeMetier)).get(cmp.value())
        sheet.find(typeMetier + "_input_" + num).value(selectedProfession.name)
        sheet.find("attr_1_" + typeMetier + "_" + num).value(selectedProfession.attr_1)
        sheet.find("attr_2_" + typeMetier + "_" + num).value(selectedProfession.attr_2)
    });

    log("setup click on " + "remove_" + typeMetier + "_" + num)
    sheet.find("remove_" + typeMetier + "_" + num).on("click", function() {
        metierSignals[num - 1].set(undefined)
    })

    sheet.find("record_" + typeMetier + "_" + num).on("click", function() {
        metierSignals[num - 1].set({
            name: sheet.find(typeMetier + "_input_" + num).value() as string,
            attr_1: sheet.find("attr_1_" + typeMetier + "_" + num).value() as string,
            attr_2: sheet.find("attr_2_" + typeMetier + "_" + num).value() as string,
        })
        mode.set("DISPLAY")
    })


    sheet.find("custom_" + typeMetier + "_" + num).on("click", function() {
        if(mode() === "EDIT")  {
            mode.set("CUSTOM")
        } else {
            mode.set("EDIT")
        }
    })

    if(sheet.find(typeMetier + "_input_" + num).value() !== "") {
        metierSignals[num - 1].set({
            name: sheet.find(typeMetier + "_input_" + num).value() as string,
            attr_1: sheet.find("attr_1_" + typeMetier + "_" + num).value() as string,
            attr_2: sheet.find("attr_2_" + typeMetier + "_" + num).value() as string,
        })
    }

    computed(function() {
        const profession = metierSignals[num - 1]()
        log(profession)
        if(profession !== undefined) {
            sheet.find(typeMetier + "_label_" + num).value(profession.name)
            sheet.find("remove_" + typeMetier + "_" + num).show()
        } else {
            log("set to undefined " + typeMetier + "_" + num)
            sheet.find(typeMetier + "_label_" + num).value("")
            sheet.find(typeMetier + "_input_" + num).value("")
            sheet.find("remove_" + typeMetier + "_" + num).hide()
        }
    }, [metierSignals[num - 1]])


}