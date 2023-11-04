import { mapEscrime } from "../utils/mappers"
import { effect, signal } from "../utils/utils"

export const setupManoeuvreEditEntry = function(entry: Component) {
    const escrimeChoiceCmp = entry.find("type_choice")
    const escrimeCmp = entry.find("type")
    const customModeCmp = entry.find("custom_mode") as Component<boolean>
    const customDisplayCmp = entry.find("custom_type")
    const listDisplayCmp = entry.find("predef_type")
    
    const customMode = signal(customModeCmp.value())

    // Signal local pour la sélection de la competence 
    let selectedVal = undefined

    if(customMode()) {
        selectedVal = escrimeCmp.value()
    } else {
        selectedVal = mapEscrime(Tables.get("escrimes").get(escrimeChoiceCmp.value())).name
    }
    const selectedEscrime = signal(selectedVal) as Signal<string>

    effect(function() {
        if(customMode()) {
            escrimeChoiceCmp.hide()
            escrimeCmp.show()
            listDisplayCmp.show()
            customDisplayCmp.hide()
        } else {
            escrimeChoiceCmp.show()
            escrimeCmp.hide()
            listDisplayCmp.hide()
            customDisplayCmp.show()
        }
    }, [customMode])

    customModeCmp.on("update", function(cmp) {
        customMode.set(cmp.value())
    })

    // Mise à jour du métier, on met à jour la profession sélectionnée
    escrimeChoiceCmp.on("update", function(cmp) {
        selectedEscrime.set(mapEscrime(Tables.get("escrimes").get(cmp.value())).name)
    })

    effect(function() {
        if(escrimeCmp.value() !== selectedEscrime()) {
            escrimeCmp.value(selectedEscrime())
        }
    }, [selectedEscrime])

    customDisplayCmp.on("click", function() {
        customModeCmp.value(true)
    })

    listDisplayCmp.on("click", function() {
        selectedEscrime.set(mapEscrime(Tables.get("escrimes").get(escrimeChoiceCmp.value())).name)
        customModeCmp.value(false)
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