import { mapEscrime } from "../utils/mappers"
import { effect, signal } from "../utils/utils"

// Fonction appelée au mode édition des traités
export const setupTraiteEditEntry = function(entry: Component) {

    // Définition des composants
    const escrimeChoiceCmp = entry.find("type_choice") as ChoiceComponent<string>
    const escrimeCmp = entry.find("type") as Component<string>
    const customType = entry.find("custom_type") as Component<string>

    const selectedEscrime = signal(mapEscrime(Tables.get("escrimes").get(escrimeChoiceCmp.value()))) as Signal<Escrime>

    escrimeChoiceCmp.on("update", function(cmp) {
        selectedEscrime.set(mapEscrime(Tables.get("escrimes").get(cmp.value())))
    })

    effect(function() {
        escrimeCmp.value(selectedEscrime().name)
    }, [selectedEscrime])

    customType.on("click", function() {
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