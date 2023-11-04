import { effect, signal } from "../utils/utils"

export const setupAvantageEditEntry = function(type: "avantage" | "desavantage", defaultValue: string) {
    return function(entry: Component<Avantage>) {
        // Définition des composants
        const avantageCmp = entry.find(type + "_choice") as ChoiceComponent<string>
        const avantageInputCmp = entry.find(type + "_input") as Component<string>
        const customCmp = entry.find("custom_" + type) as Component<string>
        const listCmp = entry.find("predef_" + type) as Component<string>
        const customModeCmp = entry.find("custom_mode") as Component<boolean>

        const customMode = signal(customModeCmp.value())

        // Valeurs par défaut
        if(avantageCmp.value() === undefined) {
            avantageCmp.value(defaultValue)
        }
        if(avantageInputCmp.value() === "") {
            avantageInputCmp.value(avantageCmp.text())
        }

        // Update de l'input associé
        avantageCmp.on("update", function(cmp) {
            avantageInputCmp.value(cmp.text())
        })

        // Affichage du mode custom
        customCmp.on("click", function() {
            customModeCmp.value(true)
        })

        listCmp.on("click", function() {
            customModeCmp.value(false)
        })

        customModeCmp.on("update", function(cmp) {
            customMode.set(cmp.value())
        })

        effect(function() {
            if(customMode()) {
                avantageCmp.hide()
                avantageInputCmp.show()
                customCmp.hide()
                listCmp.show()
            } else {
                avantageCmp.show()
                avantageInputCmp.hide()
                customCmp.show()
                avantageInputCmp.value(avantageCmp.text())
                listCmp.hide()
            }
        }, [customMode])
    }
}

export const setupAvantageDisplayEntity = function(sheet: PavillonSheet, type: "avantages" | "desavantages") {
    return function(entry: Component<Avantage>) {
        // Ajout des avantages / desavantages dans le signal de la feuille
        const avantages = sheet[type]()
        avantages[entry.id()] = entry.value()
        sheet[type].set(avantages)

        entry.find("detail_label").hide()
        entry.find("display_detail").on("click", function() {
            if(entry.find("detail_label").visible()) {
                entry.find("detail_label").hide()
            } else{
                entry.find("detail_label").show()
            }
        })
    }
}