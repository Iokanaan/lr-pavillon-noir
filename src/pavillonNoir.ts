import { pavillonSheet } from "./pavillonSheet"
import { getOptionalCompType, setupComps, setupOptionalGroup } from "./competences/competences"
import { setupAttribut } from "./main/attributs"
import { setupBaseDescription, setupJeunesse, setupOrigine, setupPeuple, setupProfession, setupReligion, setupTitre } from "./personnage/identite"
import { reputationListener } from "./main/reputation"
import { setupRepeater } from "./utils/repeaters"
import { setupDisplayedBlessures, setupSequelles } from "./combat/blessures"
import { setupWeaponEditEntry, setupWeaponViewEntry } from "./combat/armes"
import { globalSheets, optionalCompSlots } from "./globals"
import { editableLabel } from "./utils/utils"
import { setupAvantageDisplayEntity, setupAvantageEditEntry } from "./personnage/avantages"
import { setupAttrSecondaires, setupValeurMetier } from "./competences/attibutsSecondaires"
import { dropSequelle } from "./roll/dropHandler"
import { resultCallback } from "./roll/rollHandler"
import { ritesDisplayEntry } from "./arcanes/rites"
import { setupArcanes } from "./arcanes/religion"
import { pouvoirsSacres } from "./arcanes/voies"
import { setupBretteurName, setupCompEscrimeDisplayEntry, setupCompEscrimeEditEntry } from "./escrime/bretteur"
import { setupSequellesEditEntry } from "./personnage/sequelles"

// Gestion des résultats de dés
initRoll = function(result: DiceResult, callback: DiceResultCallback) {
    callback('DiceResult', resultCallback(result))
}

// Gestion des dépots de dés
dropDice = function(result, to) {
    const tags = result.total !== undefined ? result.tags : result._raw._tags as string[]
    const total = result.total !== undefined ? result.total : result._raw._raw.total as number
    if(tags.indexOf('sequelle') !== -1) {
        dropSequelle(to, total, tags)
        return
    }
}

init = function(sheet) {
    if(sheet.id() === "main") {
        const pSheet = pavillonSheet(sheet)
        globalSheets[sheet.getSheetId()] = pSheet

        // Attributs et compétences
        try {
            Tables.get("attributs").each(function(attr: AttributEntity) {
                setupAttribut(pSheet, attr)
            })
            setupValeurMetier(pSheet)
            setupComps(pSheet)
            each(optionalCompSlots, function(val, key) {
                setupOptionalGroup(pSheet, key, val, getOptionalCompType(key))
            })
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

        // Volet personnage
        try {
            pSheet.find("character_name").text(sheet.properName())
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
            setupRepeater(pSheet, "sequelles_repeater", setupSequellesEditEntry, null, null)
        } catch(e) {
            log("ERREUR: Échec de l'initialisation des informations personnelles")
        }

        // Combat & sequelles
        try {
            setupSequelles(pSheet)
            setupDisplayedBlessures(pSheet)
            setupRepeater(pSheet, "weapon_repeater", setupWeaponEditEntry, setupWeaponViewEntry, null)
        } catch(e) {
            log("ERREUR: Échec de l'onglet combat")
        }

        // Arcanes
        setupArcanes(pSheet)
        for(let i=1;i<=1;i++) {
            pouvoirsSacres(pSheet, i)
        }
        setupRepeater(pSheet, "rites_repeater", null, ritesDisplayEntry, null)
        setupRepeater(pSheet, "actes_foi_repeater", null, ritesDisplayEntry, null)
        
        // Escrime
        setupRepeater(pSheet, "escrime_repeater", setupCompEscrimeEditEntry, setupCompEscrimeDisplayEntry, null)
        setupBretteurName(pSheet)

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