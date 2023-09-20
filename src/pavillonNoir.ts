import { pavillonSheet } from "./pavillonSheet"
import { setupOptionalGroup, setupRollSelection } from "./competences/competences"
import { setupAttribut, setupValeurMetier } from "./attributs/attributs"
import { setupProfession, setupTitre } from "./bio/bio"


init = function(sheet) {
    if(sheet.id() === "main") {
        const pSheet = pavillonSheet(sheet)
        Tables.get("attributs").each(function(attr: AttributEntity) {
            setupAttribut(pSheet, attr)
        })
        setupValeurMetier(pSheet)
        setupRollSelection(pSheet)
        const optionalCompSlots: Record<string, number> = {
            "religion": 2,
            "conn_specialisee": 2,
            "art": 2,
            "artisanat": 2,
            "connaissances_colons_indigenes": 3,
            "connaissances_marins": 3,
            "langue_etrangere": 3
        }
        each(optionalCompSlots, function(val, key) {
            setupOptionalGroup(sheet, key, val)
        })
        setupTitre(pSheet)
        setupProfession(pSheet)
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