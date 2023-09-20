import { pavillonSheet } from "./pavillonSheet"
import { refreshReputationPoints, setupDisplayedReputationPoints, setupOptionalGroup, setupRollSelection } from "./competences/competences"
import { setupAttribut, setupValeurMetier } from "./attributs/attributs"
import { setupAvantageEditEntry, setupFaiblesseEditEntry, setupJeunesse, setupOrigine, setupPeuple, setupProfession, setupTitre } from "./bio/bio"
import { reputationListener } from "./reputation/reputation"
import { setupRepeater } from "./utils/repeaters"
import { setupDisplayedBlessures } from "./combat/blessures"


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
        reputationListener(pSheet, "inf")
        reputationListener(pSheet, "glo")
        setupDisplayedReputationPoints(pSheet, "glo")
        setupDisplayedReputationPoints(pSheet, "inf")
        refreshReputationPoints(pSheet, "glo")
        refreshReputationPoints(pSheet, "inf")
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