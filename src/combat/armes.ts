import { globalSheets, optionalCompSlots } from "../globals"
import { computed, effect, intToWord, mapWeaponEntity, signal } from "../utils/utils"


// Converti les competences d'arme en choix pour repeater
const compArmeToChoices = function(comptences: Table<CompetenceCombatEntity>) {
    const choices: Record<string, string> = {}
    comptences.each(function(entity) {
        choices[entity.id] = _(entity.name)
    })
    return choices
}

// Applique une couleur si modificateur
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
        new RollBuilder(entry.sheet()).title(cmp.text()).expression(expression).roll()
    })
}

// Cherche la bonne competence a prendre selon le libellé
const getCompComponent = function(sheet: PavillonSheet, comp: string, category: "arme_blanche" | "arme_trait"): CompetenceEnum | undefined {
    for(let i=1; i<=optionalCompSlots[category];i++) {
        if(sheet.find(category + "_" + i + "_choice").value() === comp) {
            return category + "_" + i as CompetenceEnum
        }
    }
    return undefined
}

export const setupWeaponEditEntry = function(entry: Component<WeaponData>) {

    // Définition des componenents
    const typeArmeChoiceCmp = entry.find("type_arme_choice") as ChoiceComponent<TypeArme>
    const typeArmeIntCmp = entry.find("type_arme_int") as Component<number>
    const modifDegatsCmp = entry.find("modif_degats_choice") as ChoiceComponent<"0" | Modificateur>
    const attrArmeCmp = entry.find("attr_arme_choice") as ChoiceComponent<AttributEnum>
    const longueurCmp = entry.find("longueur_arme_choice") as ChoiceComponent<LongueurArme>
    const modifEffCmp = entry.find("modif_eff_input") as Component<number>
    const modifFacCmp = entry.find("modif_fac_input") as Component<number>
    const compArmeCmp = entry.find("competence_arme_choice") as ChoiceComponent<string>
    const nbMainsCmp = entry.find("nb_mains_input") as Component<1 | 2>
    const hasModifDegats = entry.find("has_modificateur_degats") as Component<boolean>
    const longueurArmeInputCmp = entry.find("longueur_arme_input") as Component<string>
    const nomArme = entry.find("nom_arme_input") as Component<string>
    const templateCmp = entry.find("template_choice") as ChoiceComponent<string>
    const porteeCmp = entry.find("portee_input") as Component<number>
    const rechargeCmp = entry.find("recharge_input") as Component<string>
    const degatsCmp = entry.find("degats_input") as Component<number>
    const notesCmp = entry.find("notes_input") as Component<string>
    const cacRow = entry.find("cac_row") as Component<null>
    const distRow = entry.find("dist_row") as Component<null>

    // Définition de valeurs pas défaut
    if(entry.value().modif_degats_choice === undefined || entry.value().modif_degats_choice === null) {
        modifDegatsCmp.value("0")
    }

    if(entry.value().type_arme_choice === undefined || entry.value().type_arme_choice === null) {
        typeArmeChoiceCmp.value("cac")
    }

    if(entry.value().attr_arme_choice === undefined || entry.value().attr_arme_choice === null) {
        attrArmeCmp.value("ADR")
    }

    if(entry.value().longueur_arme_choice === undefined || entry.value().longueur_arme_choice === null) {
        longueurCmp.value("courte")
    }

    if(entry.value().modif_eff_input === undefined || entry.value().modif_eff_input === null) {
        modifEffCmp.value(0)
    }

    if(entry.value().modif_fac_input === undefined || entry.value().modif_fac_input === null) {
        modifFacCmp.value(0)
    }

    if(entry.value().competence_arme_choice === undefined || entry.value().competence_arme_choice === null) {
        compArmeCmp.value("baton")
    }

    if(entry.value().nb_mains_input === undefined || entry.value().nb_mains_input === null) {
        nbMainsCmp.value(1)
    }

    // Signal local pour définir la liste des competences à afficher selon le type d'arme
    const typeArme = signal(typeArmeChoiceCmp.value())
    effect(function() {
        let choices = undefined;
        if(typeArme() === "cac") {
            cacRow.show()
            distRow.hide()
        } else {
            cacRow.hide()
            distRow.show()
        }
        switch(typeArme()) {
            case "cac":
                typeArmeIntCmp.value(1);
                choices = compArmeToChoices(Tables.get("comp_armes_blanches"))
                break
            case "feu":
                typeArmeIntCmp.value(2);
                choices = compArmeToChoices(Tables.get("comp_armes_feu"))
                break
            case "jet":
                typeArmeIntCmp.value(3);
                choices = compArmeToChoices(Tables.get("comp_armes_trait"))
                break
            case "trait":
                typeArmeIntCmp.value(4);
                choices = compArmeToChoices(Tables.get("comp_armes_trait"))
                break
            default:
        }
        if(choices !== undefined) {
            compArmeCmp.setChoices(choices)
            if(choices[compArmeCmp.value()] === undefined) {
                compArmeCmp.value(Object.keys(choices)[0])
            }
        }
    }, [typeArme])

    typeArmeChoiceCmp.on("update", function(cmp) {
        typeArme.set(cmp.value())
    })

    // Signal local pour mettre a jour le boolean caché des modificateurs de dégats
    const degatChoice = signal(modifDegatsCmp.value())
    effect(function() {
        hasModifDegats.value(degatChoice() !== "0")
    }, [degatChoice])

    modifDegatsCmp.on("update", function(cmp) {
        degatChoice.set(cmp.value())
    })

    // Signal local sur le libellé de longueur de l'arme
    const longueurArme = signal(longueurCmp.text())
    effect(function() {
        longueurArmeInputCmp.value(longueurArme())
    }, [longueurArme])

    longueurCmp.on("update", function(cmp) {
        longueurArme.set(cmp.text())
    })

    // Remplissage des champs avec le template
    templateCmp.on("update", function(cmp) {
        if(cmp.value() !== "") {
            const arme = mapWeaponEntity(Tables.get("armes").get(cmp.value()))
            typeArmeChoiceCmp.value(arme.type)
            nomArme.value(arme.name)
            attrArmeCmp.value(arme.attr)
            compArmeCmp.value(arme.comp)
            modifEffCmp.value(arme.modif_eff)
            modifFacCmp.value(arme.modif_fac)
            modifDegatsCmp.value(arme.modif_degats)
            if(arme.type === "cac") {
                longueurCmp.value(arme.taille)
                nbMainsCmp.value(arme.mains)
            } else {
                porteeCmp.value(arme.portee)
                rechargeCmp.value(arme.recharge)
            }
            degatsCmp.value(arme.degats)
            notesCmp.value(arme.notes)
        }
    })

}