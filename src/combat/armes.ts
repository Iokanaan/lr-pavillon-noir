import { computed, signal } from "../utils/utils"

export const setupWeaponEditEntry = function(entry: Component<WeaponData>) {



    log(entry.find("mode").text())
    if(entry.find("modif_degats_choice").value() === undefined || entry.find("modif_degats_choice").value() === null) {
        entry.find("modif_degats_choice").value("0")
    }

    if(entry.find("type_arme_choice").value() === undefined || entry.find("type_arme_choice").value() === null) {
        entry.find("type_arme_choice").value("cac")
    }

    if(entry.find("attr_arme_choice").value() === undefined || entry.find("attr_arme_choice").value() === null) {
        entry.find("attr_arme_choice").value("ADR")
    }

    if(entry.find("longueur_arme_choice").value() === undefined || entry.find("longueur_arme_choice").value() === null) {
        entry.find("longueur_arme_choice").value("courte")
    }

    if(entry.find("competence_arme_choice").value() === undefined || entry.find("competence_arme_choice").value() === null) {
        entry.find("competence_arme_choice").value("baton")
    }

    // Bug sur l'initialisation
    if(entry.find("nb_mains_input").value() === 1) {
        entry.find("nb_mains_input").value(1)
    }

    log("allcomp")

    const typeArme = signal(entry.find("type_arme_choice").value() as TypeArme)
    computed(function() {
        switch(typeArme()) {
            case "cac":
                entry.find("type_arme_int").value(1)
                break
            case "feu":
                entry.find("type_arme_int").value(2)
                break
            case "jet":
                entry.find("type_arme_int").value(3)
                break
            case "trait":
                entry.find("type_arme_int").value(4)
                break
            default:
        }
    }, [typeArme])

    const degatChoice = signal(entry.find("modif_degats_choice").value() as "0" | Modificateur)
    computed(function() {
        entry.find("has_modificateur_degats").value(degatChoice() !== "0")
    }, [degatChoice])

    const longueurArme = signal(entry.find("longueur_arme_choice").text())
   log("computed")
    computed(function() {
        log(longueurArme())
        entry.find("longueur_arme_input").value(longueurArme())
    }, [longueurArme])

    log("set update 1")
    entry.find("type_arme_choice").on("click", function(cmp) {
        longueurArme.set(cmp.text())
    })

    log("set update 2")
    entry.find("type_arme_choice").on("click", function(cmp) {
        typeArme.set(cmp.value())
    })

    log("set update 3")
    entry.find("modif_degats_choice").on("click", function(cmp) {
        //degatChoice.set(cmp.value())
    })
    log("done")


}