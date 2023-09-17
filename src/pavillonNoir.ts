import { pavillonSheet } from "./pavillonSheet"
import { setupOptionalGroup, setupRollSelection } from "./competences/competences"
import { setupAttribut } from "./attributs/attributs"


init = function(sheet) {
    if(sheet.id() === "main") {
        const pSheet = pavillonSheet(sheet)
        Tables.get("attributs").each(function(attr: Attribut) {
            setupAttribut(pSheet, attr)
        })
        setupRollSelection(pSheet)
        const optionalCompSlots: Record<string, number> = {
            "religion": 2,
            "conn_specialisee": 2
        }
        each(optionalCompSlots, function(val, key) {
            setupOptionalGroup(sheet, key, val)
        })
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