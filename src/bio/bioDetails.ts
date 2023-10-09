export const setupAvantageEditEntry = function(type: "avantage" | "desavantage", defaultValue: string) {
    return function(entry: Component<Avantage>) {
        // Définition des composants
        const avantageCmp = entry.find(type + "_choice") as ChoiceComponent<string>
        const avantageInputCmp = entry.find(type + "_input") as Component<string>
        const customCmp = entry.find("custom_" + type) as Component<string>

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
            if(avantageCmp.visible()) {
                avantageCmp.hide()
                avantageInputCmp.show()
            } else {
                avantageCmp.show()
                avantageInputCmp.hide()
            }
        })
    }
}

export const setupAvantageDisplayEntity = function(sheet: PavillonSheet, type: "avantages" | "desavantages") {
    return function(entry: Component<Avantage>) {
        // Ajout des avantages / desavantages dans le signal de la feuille
        log(sheet[type])
        const avantages = sheet[type]()
        avantages[entry.id()] = entry.value()
        sheet[type].set(avantages)
    }
}