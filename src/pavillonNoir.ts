import { pavillonSheet } from "./feuille/pavillonSheet"
import { getOptionalCompType, setupComps, setupOptionalGroup } from "./competences/competences"
import { setupAttribut, setupFastRoll } from "./main/attributs"
import { setupBaseDescription, setupJeunesse, setupOrigine, setupPeuple, setupProfession, setupReligion, setupTitre } from "./personnage/identite"
import { reputationListener } from "./main/reputation"
import { setupRepeater } from "./utils/repeaters"
import { setupDisplayedBlessures, setupSequelles } from "./combat/blessures"
import { setupWeaponEditEntry, setupWeaponViewEntry } from "./combat/armes"
import { globalNavireSheets, globalPnjSheets, globalSheets, optionalCompSlots } from "./globals"
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
import { setupManoeuvreDisplayEntry, setupManoeuvreEditEntry } from "./escrime/manoeuvres"
import { setupTraiteDisplayEntry, setupTraiteEditEntry } from "./escrime/traites"
import { registreNavire, setupEffects } from "./navire/registre"
import { navireSheet } from "./feuille/navireSheet"
import { pnjSheet } from "./feuille/pnjSheet"
import { setupCompetenceDisplayEntry, setupCompetenceEditEntry, setupInitiative } from "./competences/pnjCompetences"
import { setupXp } from "./main/xp"
import { setParametrage } from "./parametrage/parametrage"
import { setupPnjAttribut } from "./main/pnjAttributs"
import { convertisseur } from "./navire/convertisseur"
import { setupEtatMature, setupVoilure, toggleMature } from "./navire/mature"
import { onArtillerieDelete, setupArtillerieDisplayEntry, setupArtillerieEditEntry, setupDegats, setupTonnageArtillerie } from "./navire/artillerie"
import { setupCoque } from "./navire/coque"
import { onJournalDelete, setupJournalDisplayEntry, setupJournalPagination } from "./journal/journal"
import { selectGestionComps, setupGestionSignalUpdates } from "./equipage/gestion"
import { displayValues } from "./equipage/comptencesGroupe"
import { setupSignalUpdates } from "./equipage/commandement"
import { gestionNombre } from "./equipage/nombre"
import { santeEquipage } from "./equipage/sante"
import { setupChargeDisplayEntry, setupTotalTonnage } from "./navire/charge"
//TODO
// tonnages
// traits de réputation
// calculer automatiquement les modif recharge par emplacement

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
            setupFastRoll(pSheet)
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
        setupRepeater(pSheet, "manoeuvres_repeater", setupManoeuvreEditEntry, setupManoeuvreDisplayEntry, null)
        setupRepeater(pSheet, "traites_repeater", setupTraiteEditEntry, setupTraiteDisplayEntry, null)

        setupXp(pSheet)

        setParametrage(pSheet)

        setupRepeater(pSheet, "journal_repeater", null, setupJournalDisplayEntry, onJournalDelete(pSheet))
        setupJournalPagination(pSheet)
    }  
    if(sheet.id() === "Navire") {
        const nSheet = navireSheet(sheet)
        globalNavireSheets[sheet.getSheetId()] = nSheet
        nSheet.find("navire_row").show()
        nSheet.find("equipage_row").hide()
        nSheet.find("equipage_tab").on("click", function(cmp) {
            nSheet.find("equipage_row").show()
            nSheet.find("navire_row").hide()
            cmp.addClass("bg-light")
            cmp.addClass("text-dark")
            nSheet.find("navire_tab").removeClass("bg-light")
            nSheet.find("navire_tab").removeClass("text-dark")
        })
        nSheet.find("navire_tab").on("click", function(cmp) {
            nSheet.find("equipage_row").hide()
            nSheet.find("navire_row").show()
            cmp.addClass("bg-light")
            cmp.addClass("text-dark")
            nSheet.find("equipage_tab").removeClass("bg-light")
            nSheet.find("equipage_tab").removeClass("text-dark")
        })
        nSheet.find("navire_name").text(sheet.properName())
        const labels: string[] = [
            "categorie",
            "capitaine",
            "tonnage",
            "greement",
            "tirant",
            "proue",
            "immergee",
            "hors_tout",
            "equipe_maxi",
            "mini_manoeuvre",
            "gardes",
            "soldats",
            "cartes",
            "instruments",
            "otages",
            "journal",
            "pavillons",
            "lettres",
            "eau",
            "vivres",
            "bois",
            "vivres_frais",
            "boulets",
            "soins",
            "modif_reussite_tribord",
            "modif_reussite_babord",
            "modif_reussite_proue",
            "modif_reussite_poupe",
            "modif_reussite_mat",
            "modif_reussite_misaine",
            "modif_reussite_artimon",
            "manoeuvrabilite",
            "pres",
            "largue",
            "grand_largue",
            "vent_arriere",
            "p_jour"
        ]
        convertisseur(nSheet)
        setupRepeater(nSheet, "artillerie_repeater", setupArtillerieEditEntry, setupArtillerieDisplayEntry, onArtillerieDelete(nSheet))
        setupEtatMature(nSheet)
        toggleMature(nSheet)
        labels.forEach(function(label) {
            registreNavire(nSheet, label)
        })
        setupDegats(nSheet)
        setupEffects(nSheet)
        setupCoque(nSheet)
        setupTonnageArtillerie(nSheet)
        setupSignalUpdates(nSheet)
        setupGestionSignalUpdates(nSheet)
        selectGestionComps(nSheet)
        displayValues(nSheet)
        gestionNombre(nSheet)
        santeEquipage(nSheet)
        setupVoilure(nSheet)
        setupRepeater(nSheet, "charge_repeater", null, setupChargeDisplayEntry, null)
        setupTotalTonnage(nSheet)
    }
    if(sheet.id() === "PNJ") {
        const npcSheet = pnjSheet(sheet)
        globalPnjSheets[sheet.getSheetId()] = npcSheet
        npcSheet.find("character_name").text(sheet.properName())
        Tables.get("attributs").each(function(attr: AttributEntity) {
            setupPnjAttribut(npcSheet, attr)
        })
        setupInitiative(npcSheet)
        setupBaseDescription(npcSheet, "taille")
        setupBaseDescription(npcSheet, "poids")
        setupBaseDescription(npcSheet, "age")
        setupReligion(npcSheet)
        setupTitre(npcSheet)
        setupProfession(npcSheet, "profession", 2)
        setupProfession(npcSheet, "poste_bord", 1)
        setupPeuple(npcSheet)
        setupOrigine(npcSheet)
        setupJeunesse(npcSheet, 1)
        setupJeunesse(npcSheet, 2)
        setupDisplayedBlessures(npcSheet)
        reputationListener(npcSheet, "inf")
        reputationListener(npcSheet, "glo")

        setupRepeater(npcSheet, "competences_repeater", setupCompetenceEditEntry, setupCompetenceDisplayEntry, null)
    }
}

getCriticalHits = function(result) {
    const hits = {
        "20": {
            "critical": [1],
            "fumble": [20],
        },
        "10": {
            "critical": [1],
            "fumble": [10]
        },
        "12": {
            "critical": [1],
            "fumble": [12]
        }
    } as any
    if(result.allTags.indexOf("localisation") !== -1 || result.allTags.indexOf("localisation_navire") !== -1) {
        hits["6"] = {"yellow":[1,2,3,4,5,6]}
    }
    return hits
}