import { optionalCompSlots } from "../globals"
import { computed, signal } from "../utils/utils"

const mapWeaponEntity = function(e: WeaponEntity): Weapon {
    return {
        id: e.id,
        attr: e.attr,
        type: e.type,
        modif_eff: parseInt(e.modif_eff),
        modif_fac: parseInt(e.modif_fac),
        portee: parseInt(e.portee),
        degats: parseInt(e.degats),
        recharge: e.recharge,
        comp: e.comp,
        modif_degats: e.modif_degats,
        mains: parseInt(e.mains),
        taille: e.taille,
        name: e.name,
        notes: e.notes
    }
}

const compArmeToChoices = function(comptences: Table<CompetenceCombatEntity>) {
    const choices: Record<string, string> = {}
    comptences.each(function(entity) {
        choices[entity.id] = entity.name
    })
    return choices
}

export const setupWeaponViewEntry = function(entry: Component<WeaponData>) {
    entry.find("weapon_title").on("click", function(cmp) {
        let nDice = 0
        switch(entry.value().type_arme_choice) {
            case "feu":
                nDice = entry.sheet().get(entry.value().competence_arme_choice + "_val").value()
                break
            case "cac":
                nDice = fetchDice(entry.sheet(), entry.value().competence_arme_choice, "armes_blanches")
                break
            case "jet":
            case "trait":
                nDice = fetchDice(entry.sheet(), entry.value().competence_arme_choice, "armes_trait")
                break
        }
        let expression = ""
        nDice += entry.value().modif_eff_input
        if(nDice !== 0) {
            expression += nDice + "d10 "
        } else {
            expression += "1d12 "
        }
        expression += "<={1:2} " + (entry.sheet().get(entry.value().attr_arme_choice + "_val").value() + entry.value().modif_fac_input)
        expression = "(" + expression + ")"
        expression += " + 1d6[localisation]"
        expression = "(" + expression + ")[attack]"
        log(expression)
        new RollBuilder(entry.sheet()).title(cmp.text()).expression(expression).roll()
    })
}

const fetchDice = function(sheet: Sheet, comp: string, category: "armes_blanches" | "armes_trait"): number {

    for(let i=1; i<=optionalCompSlots[category];i++) {
        log("look for " + comp + " === " + sheet.get(category + "_" + i + "_choice").value())
        log(comp  == sheet.get(category + "_" + i + "_choice").value())
        log(comp  === sheet.get(category + "_" + i + "_choice").value())
        if(sheet.get(category + "_" + i + "_choice").value() === comp) {
            log("retirng")
            return sheet.get(category + "_" + i + "_val").value()
        }
    }
    return 0
}

export const setupWeaponEditEntry = function(entry: Component<WeaponData>) {

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

    if(entry.value().modif_eff_input === undefined || entry.value().modif_eff_input === null) {
        entry.find("modif_eff_input").value(0)
    }

    if(entry.value().modif_fac_input === undefined || entry.value().modif_fac_input === null) {
        entry.find("modif_fac_input").value(0)
    }

    if(entry.find("competence_arme_choice").value() === undefined || entry.find("competence_arme_choice").value() === null) {
        entry.find("competence_arme_choice").value("baton")
    }

    // Bug sur l'initialisation
    if(entry.find("nb_mains_input").value() === 1) {
        entry.find("nb_mains_input").value(1)
    }

    const typeArme = signal(entry.find("type_arme_choice").value() as TypeArme)
    computed(function() {
        let choices = undefined;
        if(typeArme() === "cac") {
            entry.find("longueur_arme_choice").show()
            entry.find("nb_mains_input").show()
            entry.find("longueur_arme_label").show()
            entry.find("nb_mains_label").show()
            entry.find("portee_input").hide()
            entry.find("recharge_input").hide()
            entry.find("portee_label").hide()
            entry.find("portee_m_label").hide()
            entry.find("recharge_label").hide()
        } else {
            entry.find("longueur_arme_choice").hide()
            entry.find("nb_mains_input").hide()
            entry.find("longueur_arme_label").hide()
            entry.find("nb_mains_label").hide()
            entry.find("portee_input").show()
            entry.find("recharge_input").show()
            entry.find("portee_label").show()
            entry.find("portee_m_label").show()
            entry.find("recharge_label").show()
        }
        switch(typeArme()) {
            case "cac":
                entry.find("type_arme_int").value(1);
                choices = compArmeToChoices(Tables.get("comp_armes_blanches"))
                break
            case "feu":
                entry.find("type_arme_int").value(2);
                choices = compArmeToChoices(Tables.get("comp_armes_feu"))
                break
            case "jet":
                entry.find("type_arme_int").value(3);
                choices = compArmeToChoices(Tables.get("comp_armes_trait"))
                break
            case "trait":
                entry.find("type_arme_int").value(4);
                choices = compArmeToChoices(Tables.get("comp_armes_trait"))
                break
            default:
        }
        if(choices !== undefined) {
            (entry.find("competence_arme_choice") as ChoiceComponent<string>).setChoices(choices)
            if(choices[entry.find("competence_arme_choice").value()] === undefined) {
                entry.find("competence_arme_choice").value(Object.keys(choices)[0])
            }
        }
    }, [typeArme])

    const degatChoice = signal(entry.find("modif_degats_choice").value() as "0" | Modificateur)
    computed(function() {
        entry.find("has_modificateur_degats").value(degatChoice() !== "0")
    }, [degatChoice])

    const longueurArme = signal(entry.find("longueur_arme_choice").text())
    computed(function() {
        log(longueurArme())
        entry.find("longueur_arme_input").value(longueurArme())
    }, [longueurArme])

    entry.find("longueur_arme_choice").on("update", function(cmp) {
        longueurArme.set(cmp.text())
    })

    entry.find("type_arme_choice").on("update", function(cmp) {
        typeArme.set(cmp.value())
    })

    entry.find("modif_degats_choice").on("update", function(cmp) {
        degatChoice.set(cmp.value())
    })

    entry.find("template_choice").on("update", function(cmp) {
        if(cmp.value() !== "") {
            const arme = mapWeaponEntity(Tables.get("armes").get(cmp.value()))
            entry.find("type_arme_choice").value(arme.type)
            entry.find("nom_arme_input").value(arme.name)
            entry.find("attr_arme_choice").value(arme.attr)
            entry.find("competence_arme_choice").value(arme.comp)
            entry.find("modif_eff_input").value(arme.modif_eff)
            entry.find("modif_fac_input").value(arme.modif_fac)
            entry.find("modif_degats_choice").value(arme.modif_degats)
            if(arme.type === "cac") {
                entry .find("longueur_arme_choice").value(arme.taille)
                entry.find("nb_mains_input").value(arme.mains)
            } else {
                entry.find("portee_input").value(arme.portee)
                entry.find("recharge_input").value(arme.recharge)
            }
            entry.find("degats_input").value(arme.degats)
            entry.find("notes_input").value(arme.notes)
        }
    })

}