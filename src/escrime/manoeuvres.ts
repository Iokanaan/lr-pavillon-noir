import { mapEscrime } from "../utils/mappers"
import { effect, signal } from "../utils/utils"

export const setupManoeuvreEditEntry = function(entry: Component) {
    const escrimeChoiceCmp = entry.find("type_choice")
    const escrimeCmp = entry.find("type")
    // Signal local pour la sélection de la competence 
    const selectedEscrime = signal(mapEscrime(Tables.get("escrimes").get(escrimeChoiceCmp.value()))) as Signal<Escrime>

    // Mise à jour du métier, on met à jour la profession sélectionnée
    escrimeChoiceCmp.on("update", function(cmp) {
        selectedEscrime.set(mapEscrime(Tables.get("escrimes").get(cmp.value())))
    })

    effect(function() {
        escrimeCmp.value(selectedEscrime().name)
    }, [selectedEscrime])

    entry.find("custom_type").on("click", function() {
        if(escrimeChoiceCmp.visible()) {
            escrimeChoiceCmp.hide()
            escrimeCmp.show()
        } else {
            escrimeChoiceCmp.show()
            escrimeCmp.hide()
        }
    })

}

export const setupManoeuvreDisplayEntry = function(entry: Component) {
    entry.find("effet_row").hide()
    entry.find("display_effet").on("click", function() {
        if(entry.find("effet_row").visible()) {
            entry.find("effet_row").hide()
        } else {
            entry.find("effet_row").show()
        }
    })
}