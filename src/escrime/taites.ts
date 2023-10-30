import { mapEscrime } from "../utils/mappers"
import { effect, signal } from "../utils/utils"

export const setupTraiteEditEntry = function(entry: Component) {
    log("t")
    const escrimeChoiceCmp = entry.find("type_choice")
    const escrimeCmp = entry.find("type")
    // Signal local pour la sélection de la competence 
    const selectedEscrime = signal(mapEscrime(Tables.get("escrimes").get(escrimeChoiceCmp.value()))) as Signal<Escrime>
    log("totto")
    // Mise à jour du métier, on met à jour la profession sélectionnée
    escrimeChoiceCmp.on("update", function(cmp) {
        selectedEscrime.set(mapEscrime(Tables.get("escrimes").get(cmp.value())))
    })

    effect(function() {
        escrimeCmp.value(selectedEscrime().name)
    }, [selectedEscrime])
    log("totto2")
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

export const setupTraiteDisplayEntry = function(entry: Component) {
    entry.find("contenu_val").hide()
    entry.find("display_contenu").on("click", function() {
        if(entry.find("contenu_val").visible()) {
            entry.find("contenu_val").hide()
        } else {
            entry.find("contenu_val").show()
        }
    })
}