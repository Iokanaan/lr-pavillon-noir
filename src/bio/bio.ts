import { computed, signal } from "../utils/utils"

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

const professionToChoice = function(professions: ProfessionEntity[]) {
    const choices: Record<string, string> = {}
    for(let i=0; i<professions.length; i++) {
        choices[professions[i].id] = professions[i].name
    }
    return choices
}

export const setupProfession = function(sheet: PavillonSheet) {
    const professionByType: Record<string, ProfessionEntity[]> = {}
    Tables.get("types_professions").each(function(val) {
        professionByType[val.id] = []
    })
    Tables.get("professions").each(function(val) {
        professionByType[val.type].push(val)
    });

    log("set choice");

    const modes: Signal<"EDIT" | "CUSTOM" | "DISPLAY">[] = [signal("DISPLAY"), signal("DISPLAY")];

    setupSingleProfession(sheet, professionByType, modes[0], 1)
    setupSingleProfession(sheet, professionByType, modes[1], 2)

    sheet.find("add_profession").on("click", function() {
        if(sheet.professions[0]() === undefined && modes[0]() === "DISPLAY") {
            modes[0].set("EDIT")
        } else if (sheet.professions[1]() === undefined) {
            modes[1].set("EDIT")
        }
    })

    computed(function() {
        if(sheet.professions[0]() === undefined && sheet.professions[1]() === undefined) {
            sheet.find("no_profession").show()
        } else {
            sheet.find("no_profession").hide()
        }
    }, sheet.professions)
}

const setupSingleProfession = function(sheet: PavillonSheet, professionByType: Record<string, ProfessionEntity[]>, mode: Signal<"DISPLAY"|"EDIT"|"CUSTOM">, num: number) {

    (sheet.find("type_profession_choice_" + num) as ChoiceComponent<string>).on("update", function(cmp) {
        const professionChoices = professionToChoice(professionByType[cmp.value()]);
        (sheet.find("profession_choice_" + num) as ChoiceComponent<string>).setChoices(professionChoices)
        sheet.find("profession_choice_" + num).value(Object.keys(professionChoices)[0])
    });

    computed(function() {
        switch(mode()) {
            case "EDIT":
                sheet.find("no_profession").hide()
                sheet.find("type_profession_choice_" + num).show()
                sheet.find("profession_choice_" + num).show()
                sheet.find("profession_input_" + num).hide()
                sheet.find("attr_1_profession_" + num).hide()
                sheet.find("attr_2_profession_" + num).hide()
                sheet.find("custom_profession_" + num).show()
                sheet.find("record_profession_" + num).show()
                sheet.find("profession_label_" + num).hide()
                sheet.find("remove_profession_" + num).hide()
                break
            case "CUSTOM":
                sheet.find("type_profession_choice_" + num).hide()
                sheet.find("profession_choice_" + num).hide()
                sheet.find("profession_input_" + num).show()
                sheet.find("attr_1_profession_" + num).show()
                sheet.find("attr_2_profession_" + num).show()
                sheet.find("custom_profession_" + num).show()
                sheet.find("record_profession_" + num).show()
                sheet.find("profession_label_" + num).hide()
                sheet.find("remove_profession_" + num).hide()
                break
            case "DISPLAY":
                sheet.find("type_profession_choice_" + num).hide()
                sheet.find("profession_choice_" + num).hide()
                sheet.find("profession_input_" + num).hide()
                sheet.find("attr_1_profession_" + num).hide()
                sheet.find("attr_2_profession_" + num).hide()
                sheet.find("custom_profession_" + num).hide()
                sheet.find("record_profession_" + num).hide()
                sheet.find("profession_label_" + num).show()
                sheet.find("remove_profession_" + num).show()
                break
        }
    }, [mode]);


    (sheet.find("profession_choice_" + num) as ChoiceComponent<string>).on("update", function(cmp) {
        const selectedProfession = Tables.get("professions").get(cmp.value())
        sheet.find("profession_input_" + num).value(selectedProfession.name)
        sheet.find("attr_1_profession_" + num).value(selectedProfession.attr_1)
        sheet.find("attr_2_profession_" + num).value(selectedProfession.attr_2)
    })

    sheet.find("remove_profession_" + num).on("click", function() {
        sheet.professions[num - 1].set(undefined)
    })

    sheet.find("record_profession_" + num).on("click", function() {
        sheet.professions[num - 1].set({
            name: sheet.find("profession_input_" + num).value() as string,
            attr_1: sheet.find("attr_1_profession_" + num).value() as string,
            attr_2: sheet.find("attr_2_profession_" + num).value() as string,
        })
        mode.set("DISPLAY")
    })


    sheet.find("custom_profession_" + num).on("click", function() {
        if(mode() === "EDIT")  {
            mode.set("CUSTOM")
        } else {
            mode.set("EDIT")
        }
    })

    if(sheet.find("profession_input_" + num).value() !== "") {
        sheet.professions[num - 1].set({
            name: sheet.find("profession_input_" + num).value() as string,
            attr_1: sheet.find("attr_1_profession_" + num).value() as string,
            attr_2: sheet.find("attr_2_profession_" + num).value() as string,
        })
    }

    computed(function() {
        const profession = sheet.professions[num - 1]()
        log(profession)
        if(profession !== undefined) {
            sheet.find("profession_label_" + num).value(profession.name)
            sheet.find("remove_profession_" + num).show()
        } else {
            log("set to undefined")
            sheet.find("profession_label_" + num).value("")
            sheet.find("profession_input_" + num).value("")
            sheet.find("remove_profession_" + num).hide()
        }
    }, [sheet.professions[num - 1]])


}