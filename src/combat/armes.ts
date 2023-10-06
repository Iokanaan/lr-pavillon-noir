import { globalSheets, optionalCompSlots } from "../globals"
import { computed, effect, intToWord, signal } from "../utils/utils"

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

const setVirtualColor = function(cmp: Component<string>, refValue: number) {
    if(parseInt(cmp.value()) > refValue) {
        cmp.addClass("text-success")
        cmp.removeClass("text-danger")
    } else if(parseInt(cmp.value()) < refValue) {
        cmp.removeClass("text-success")
        cmp.addClass("text-danger")       
    } else {
        cmp.removeClass("text-success")
        cmp.removeClass("text-danger")
    }
}

export const setupWeaponViewEntry = function(entry: Component<WeaponData>) {
    const sheet = globalSheets[entry.sheet().getSheetId()]
        
    const attrModifier = signal(0)
    const virtualAttr = computed(function() {
        const virtualVal = sheet.attr[entry.value().attr_arme_choice]() + attrModifier() + entry.value().modif_fac_input
        entry.find("roll_formula_attr").value(virtualVal)
        setVirtualColor(entry.find("roll_formula_attr"), sheet.attr[entry.value().attr_arme_choice]() + entry.value().modif_fac_input)
        return virtualVal
    }, [sheet.attr[entry.value().attr_arme_choice], attrModifier])

    const compModifier = signal(0)
    const virtualComp = computed(function() {
        let compVal = 0
        let compId = undefined
        switch(entry.value().type_arme_choice) {
            case "feu":
                compVal = sheet.comp[entry.value().competence_arme_choice].value()
                break
            case "cac":
                compId = getCompComponent(sheet, entry.value().competence_arme_choice, "arme_blanche") 
                if(compId !== undefined) {
                    compVal = sheet.comp[compId].value()
                }
                break
            case "jet":
            case "trait":
                compId = getCompComponent(sheet, entry.value().competence_arme_choice, "arme_trait") 
                if(compId !== undefined) {
                    compVal = sheet.comp[compId].value()
                }
                break
        }
        log(compVal)
        const virtualVal = compVal + compModifier() + entry.value().modif_eff_input
        entry.find("roll_formula_comp").value(virtualVal)
        setVirtualColor(entry.find("roll_formula_comp"), compVal + entry.value().modif_eff_input)
        return virtualVal
    }, [
        sheet.comp["arme_blanche_1"].value,
        sheet.comp["arme_blanche_2"].value,
        sheet.comp["arme_blanche_3"].value,
        sheet.comp["arme_blanche_4"].value,
        sheet.comp["arme_trait_1"].value,
        sheet.comp["arme_trait_2"].value,
        sheet.comp["mousquet"].value,
        sheet.comp["pistolet"].value,
        sheet.comp["grenade"].value,
        compModifier
    ])

    const damageModifier = signal(0)
    log("setyp deatag")
    const virtualDamage = computed(function() {
        let bonus = 0
        if(entry.value().has_modificateur_degats && entry.value().modif_degats_choice !== "0") {
            bonus += sheet.modifiers[entry.value().modif_degats_choice as Modificateur]()
        }
        const virtualVal = entry.value().degats_input + bonus + damageModifier() 
        entry.find("roll_degats").value(virtualVal)
        setVirtualColor(entry.find("roll_degats"), entry.value().degats_input + bonus)
        return virtualVal
    },[sheet.modifiers["MDFor"], sheet.modifiers["MDAdr"], damageModifier])

    entry.find("eff_plus").on("click", function() {
        compModifier.set(compModifier() + 1)
    })

    entry.find("eff_minus").on("click", function() {
        compModifier.set(compModifier() - 1)
    })

    entry.find("fac_plus").on("click", function() {
        attrModifier.set(attrModifier() + 1)
    })

    entry.find("fac_minus").on("click", function() {
        attrModifier.set(attrModifier() - 1)
    })

    entry.find("degats_plus").on("click", function() {
        damageModifier.set(damageModifier() + 1)
    })

    entry.find("degats_minus").on("click", function() {
        damageModifier.set(damageModifier() - 1)
    })

    entry.find("eff_plus").hide()
    entry.find("eff_minus").hide()
    entry.find("fac_plus").hide()
    entry.find("fac_minus").hide()
    entry.find("degats_plus").hide()
    entry.find("degats_minus").hide()

    entry.find("edit_attack").on("click", function() {
        if(entry.find("eff_plus").visible()) {
            entry.find("eff_plus").hide()
            entry.find("eff_minus").hide()
            entry.find("fac_plus").hide()
            entry.find("fac_minus").hide()
            entry.find("degats_plus").hide()
            entry.find("degats_minus").hide()
            attrModifier.set(0)
            compModifier.set(0)
            damageModifier.set(0)
        } else {
            entry.find("eff_plus").show()
            entry.find("eff_minus").show()
            entry.find("fac_plus").show()
            entry.find("fac_minus").show()
            entry.find("degats_plus").show()
            entry.find("degats_minus").show()
        }            
    })

    entry.find("weapon_title").on("click", function(cmp) {
        let expression = ""
        if(virtualComp() !== 0) {
        expression += virtualComp() + "d10 "
        } else {
            expression += "1d12 "
        }
        expression += "<={1:2} " + virtualAttr()
        expression = "(" + expression + ")"
        expression += " + 1d6[localisation]"
        expression = "(" + expression + ")[attack," + "damage_" + intToWord(virtualDamage()) + "]"
        log(expression)
        new RollBuilder(entry.sheet()).title(cmp.text()).expression(expression).roll()
    })
}

const getCompComponent = function(sheet: PavillonSheet, comp: string, category: "arme_blanche" | "arme_trait"): CompetenceEnum | undefined {
    log(category)
    for(let i=1; i<=optionalCompSlots[category];i++) {
        log(sheet.find(category + "_" + i + "_choice").value())
        if(sheet.find(category + "_" + i + "_choice").value() === comp) {
            return category + "_" + i as CompetenceEnum
        }
    }
    return undefined
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
    effect(function() {
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
    effect(function() {
        entry.find("has_modificateur_degats").value(degatChoice() !== "0")
    }, [degatChoice])

    const longueurArme = signal(entry.find("longueur_arme_choice").text())
    effect(function() {
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