import { mapEscrime } from "../utils/mappers"
import { effect, signal } from "../utils/utils"

// Fonction définissant le mode édition des manoeuvres
export const setupManoeuvreEditEntry = function(entry: Component) {

    // Définition des composants
    const escrimeChoiceCmp = entry.find("type_choice")
    const escrimeCmp = entry.find("type")
    const customModeCmp = entry.find("custom_mode") as Component<boolean>
    const customDisplayCmp = entry.find("custom_type")
    const listDisplayCmp = entry.find("predef_type")
    
    const customMode = signal(customModeCmp.value())

    // Signal local pour la sélection de la competence 
    let selectedVal = undefined

    // Mise à jour de la valeur sélectionnée en fonction de si on est en mode custom ou nom
    if(customMode()) {
        selectedVal = escrimeCmp.value()
    } else {
        selectedVal = mapEscrime(Tables.get("escrimes").get(escrimeChoiceCmp.value())).name
    }
    const selectedEscrime = signal(selectedVal) as Signal<string>

    // Affichange des champs selon si on est en mode custom ou non
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

    // Mise à jour du signal custom en fonction de la valeur de la checkbox
    customModeCmp.on("update", function(cmp) {
        customMode.set(cmp.value())
    })

    // Mise à jour du métier, on met à jour la profession sélectionnée
    escrimeChoiceCmp.on("update", function(cmp) {
        selectedEscrime.set(mapEscrime(Tables.get("escrimes").get(cmp.value())).name)
    })

    // Mise à jour du champ input en fonction de l'escrime sélectionnée
    effect(function() {
        if(escrimeCmp.value() !== selectedEscrime()) {
            escrimeCmp.value(selectedEscrime())
        }
    }, [selectedEscrime])

    // Fonctions de bascule mode custom / liste
    customDisplayCmp.on("click", function() {
        customModeCmp.value(true)
    })

    listDisplayCmp.on("click", function() {
        selectedEscrime.set(mapEscrime(Tables.get("escrimes").get(escrimeChoiceCmp.value())).name)
        customModeCmp.value(false)
    })

}

// Fonction définissant le mode affichage des manoeuvres
export const setupManoeuvreDisplayEntry = function(entry: Component) {

    const effetRow = entry.find("effet_row") as Component<null>
    const displayCmp = entry.find("display_effet") as Component<string> 

    effetRow.hide()
    displayCmp.on("click", function() {
        if(effetRow.visible()) {
            effetRow.hide()
        } else {
            effetRow.show()
        }
    })
}