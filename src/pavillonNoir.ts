import { pavillonSheet } from "./pavillonSheet"
import { setupAttrSecondaires, setupComps, setupOptionalGroup, setupValeurMetier } from "./competences/competences"
import { setupAttribut } from "./attributs/attributs"
import { setupBaseDescription, setupJeunesse, setupOrigine, setupPeuple, setupProfession, setupReligion, setupTitre } from "./bio/bio"
import { reputationListener } from "./reputation/reputation"
import { setupRepeater } from "./utils/repeaters"
import { setupDisplayedBlessures, setupSequelles } from "./combat/blessures"
import { setupWeaponEditEntry, setupWeaponViewEntry } from "./combat/armes"
import { globalSheets, optionalCompSlots } from "./globals"
import { getSequelleData, rollResultHandler } from "./roll/rollHandler"
import { setupAvantageDisplayEntity, setupAvantageEditEntry } from "./bio/bioDetails"
import { editableLabel } from "./utils/utils"


init = function(sheet) {
    if(sheet.id() === "main") {
        
        
        const pSheet = pavillonSheet(sheet)
        globalSheets[sheet.getSheetId()] = pSheet
 
        try {

            Tables.get("attributs").each(function(attr: AttributEntity) {
                setupAttribut(pSheet, attr)
            })
            setupValeurMetier(pSheet)
            setupComps(pSheet)

            each(optionalCompSlots, function(val, key) {
                if(key === "arme_blanche" || key === "arme_trait") {
                    setupOptionalGroup(pSheet, key, val, "choice")
                } else {
                    setupOptionalGroup(pSheet, key, val, "input")
                }
            })

            pSheet.find("character_name").text(sheet.properName())
            setupAttrSecondaires(pSheet)
        } catch(e) {
            log("ERREUR: Échec de l'initilisation des compétences et caractéristiques")
        }
        try {
            reputationListener(pSheet, "inf")
            reputationListener(pSheet, "glo")
        } catch(e) {
            log("ERREUR: Échec de l'initialisation de la réputation")
        }
        try {
            setupBaseDescription(pSheet, "taille")
            setupBaseDescription(pSheet, "poids")
            setupBaseDescription(pSheet, "age")
            setupReligion(pSheet)
            setupTitre(pSheet)
            setupProfession(pSheet, "profession", 2)
            setupProfession(pSheet, "poste_bord", 1)
            setupPeuple(pSheet)
            setupOrigine(pSheet)
            setupJeunesse(pSheet, 1)
            setupJeunesse(pSheet, 2)
            setupRepeater(pSheet, "avantage_repeater", setupAvantageEditEntry("avantage", "animal_compagnie"), setupAvantageDisplayEntity(pSheet, "avantages"), null)
            setupRepeater(pSheet, "faiblesse_repeater", setupAvantageEditEntry("desavantage", "borgne"), setupAvantageDisplayEntity(pSheet, "avantages"), null)
            editableLabel(pSheet.find("history_title"), pSheet.find("history_txt"), pSheet.find("history_input"), pSheet.find("history_col"), pSheet.find("history_input_col"))
            editableLabel(pSheet.find("contact_title"), pSheet.find("contact_txt"), pSheet.find("contact_input"), pSheet.find("contact_col"), pSheet.find("contact_input_col"))
        } catch(e) {
            log("ERREUR: Échec de l'initialisation des informations personnelles")
        }

        try {
            setupSequelles(pSheet)
            setupDisplayedBlessures(pSheet)
            setupRepeater(pSheet, "weapon_repeater", setupWeaponEditEntry, setupWeaponViewEntry, null)
        } catch(e) {
            log("ERREUR: Échec de l'onglet combat")
        }
    }  
}

initRoll = rollResultHandler

dropDice = function(result, to) {
    const tags = result.total !== undefined ? result.tags : result._raw._tags
    const total = result.total !== undefined ? result.total : result._raw._raw.total 
    if(tags.indexOf('sequelle') !== -1) {
        const sequelle = getSequelleData(total, tags)
        const allSequelles = to.get("sequelles_repeater").value() 
        allSequelles[Math.random().toString().slice(2).substring(0, 10)] = sequelle
        to.setData({"sequelles_repeater": allSequelles})
    }
}

getCriticalHits = function(result) {
    return {
        "20": {
            "critical": [1],
            "fumble": [20],
        },
        "10": {
            "critical": [1],
            "fumble": [10]
        }
    }
}