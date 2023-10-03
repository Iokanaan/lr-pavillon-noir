import { pavillonSheet } from "./pavillonSheet"
import { setupChoiceGroup, setupComps, setupDisplayedReputationPoints, setupOptionalGroup } from "./competences/competences"
import { setupAttribut, setupValeurMetier } from "./attributs/attributs"
import { setupAge, setupAvantageEditEntry, setupFaiblesseEditEntry, setupJeunesse, setupOrigine, setupPeuple, setupPoids, setupProfession, setupReligion, setupTaille, setupTitre } from "./bio/bio"
import { reputationListener } from "./reputation/reputation"
import { setupRepeater } from "./utils/repeaters"
import { setupDisplayedBlessures, setupSequelles } from "./combat/blessures"
import { setupWeaponEditEntry, setupWeaponViewEntry } from "./combat/armes"
import { globalSheets, optionalCompSlots } from "./globals"
import { getSequelleData, rollResultHandler } from "./roll/rollHandler"


init = function(sheet) {
    if(sheet.id() === "main") {
        
        const pSheet = pavillonSheet(sheet)
        globalSheets[sheet.getSheetId()] = pSheet
        Tables.get("attributs").each(function(attr: AttributEntity) {
            setupAttribut(pSheet, attr)
        })
        setupValeurMetier(pSheet)
        setupComps(pSheet)

        each(optionalCompSlots, function(val, key) {
            if(key === "arme_blanche" || key === "arme_trait") {
                setupChoiceGroup(pSheet, key, val)
            } else {
                setupOptionalGroup(pSheet, key, val)
            }

        })
        pSheet.find("character_name").text(sheet.properName())
        reputationListener(pSheet, "inf")
        reputationListener(pSheet, "glo")
        setupDisplayedReputationPoints(pSheet, "glo")
        setupDisplayedReputationPoints(pSheet, "inf")
        setupTaille(pSheet)
        setupPoids(pSheet)
        setupAge(pSheet)
        setupReligion(pSheet)
        setupTitre(pSheet)
        setupProfession(pSheet, "profession", 2)
        setupProfession(pSheet, "poste_bord", 1)
        setupPeuple(pSheet)
        setupOrigine(pSheet)
        setupJeunesse(pSheet, 1)
        setupJeunesse(pSheet, 2)
        setupRepeater(pSheet, "avantage_repeater", setupAvantageEditEntry, null, null)
        setupRepeater(pSheet, "faiblesse_repeater", setupFaiblesseEditEntry, null, null)
        setupDisplayedBlessures(pSheet)
        setupSequelles(pSheet)
        setupRepeater(pSheet, "weapon_repeater", setupWeaponEditEntry, setupWeaponViewEntry, null)
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