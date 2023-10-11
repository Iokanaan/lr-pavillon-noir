import { mapPeuple } from "../utils/mappers"
import { effect, signal } from "../utils/utils"


export const setupTitre = function(sheet: PavillonSheet) {

    // Définition des components
    const titreRowCmp = sheet.find("titre_col") as Component<null>
    const changeTitreRowCmp = sheet.find("change_titre_col") as Component<null>
    const addTitreCmp = sheet.find("add_titre") as Component<string>
    const titreInputCmp = sheet.find("titre_input") as Component<string>

    // Affichage de l'input au clic sur le titre
    addTitreCmp.on("click", function() {
        if(titreRowCmp.visible()) {
            titreRowCmp.hide()
            changeTitreRowCmp.show()
        } else {
            if(sheet.titre() !== "" && sheet.titre() !== undefined) {
                titreRowCmp.show()
            }
            changeTitreRowCmp.hide()
        }
    })

    // Mise à jour de la titre dans la feuille
    titreInputCmp.on("update", function(cmp) {
        sheet.titre.set(cmp.value() as string)
        titreRowCmp.show()
        changeTitreRowCmp.hide()
    })
}

export const setupReligion = function(sheet: PavillonSheet) {

    // Définition des components
    const religionRowCmp = sheet.find("religion_row") as Component<null>
    const religionChangeRowCmp = sheet.find("religion_change_row") as Component<null>
    const religionLabelCmp = sheet.find("religion_label") as Component<string>
    const religionInputCmp = sheet.find("religion_input") as Component<string>
    const religionTitleCmp = sheet.find("religion_title") as Component<string>

    // Passage en mode édition au clic
    religionTitleCmp.on("click", function() {
        if(religionRowCmp.visible()) {
            religionRowCmp.hide()
            religionChangeRowCmp.show()
        } else {
            religionRowCmp.show()
            religionChangeRowCmp.hide()
        }
    })

    // Mise à jour de la religion dans la feuille
    religionInputCmp.on("update", function(cmp) {
        sheet.religion.set(cmp.value())
    })
    
    // Effet d'affichage de la religion selon sa définition dans la feuille
    effect(function() {
        if(sheet.religion() !== undefined && sheet.religion() !== "") {
            religionLabelCmp.value(sheet.religion())
            religionRowCmp.show()
            religionChangeRowCmp.hide()
        } else {
            religionRowCmp.hide()
            religionChangeRowCmp.show()
        }
    },[sheet.religion])
}

export const setupBaseDescription = function(sheet: PavillonSheet, type: "taille" | "age" | "poids") {

    // Définition des components
    const titleCmp = sheet.find(type + "_title") as Component<string>
    const labelCmp = sheet.find(type + "_label") as Component<string>
    const inputCmp = sheet.find(type + "_input") as Component<string>

    // Passage en mode édition au clic
    titleCmp.on("click", function() {
        if(labelCmp.visible()) {
            labelCmp.hide()
            inputCmp.show()
        } else {
            labelCmp.show()
            inputCmp.hide()
        }
    })

    // Si la valeur renseignée est un entier, on met a jour la valeur dans la feuille
    // Note: on n'utilise pas le NumberInput car il déclenche un "update" à chaque chiffre entré
    inputCmp.on("update", function(cmp) {
        if(/^[0-9]*$/.test(cmp.value() as string)) {
            sheet[type].set(parseInt(cmp.value() as string))
        }
    })

    // On affiche le texte associé à chaque changement de valeur
    effect(function() {
        labelCmp.show()
        inputCmp.hide()
    }, [sheet[type]])
}

export const setupOrigine = function(sheet: PavillonSheet) {

    // Définition des components
    const socialeTitleCmp = sheet.find("change_origine_sociale") as Component<string> 
    const customSocialeCmp = sheet.find("custom_origine_sociale") as Component<string>
    const socialeChoiceCmp = sheet.find("origine_sociale_choice") as ChoiceComponent<string>
    const socialeInputCmp = sheet.find("origine_sociale_input") as Component<string>
    const socialeLabelCmp = sheet.find("origine_sociale_label") as Component<string>
    const socialeRowCmp = sheet.find("sociale_row") as Component<null>
    const changeSocialeRowCmp = sheet.find("change_sociale_row") as Component<null>

    // Affichage du mode édition au clic
    socialeTitleCmp.on("click", function() {
        if(socialeRowCmp.visible()) {
            socialeRowCmp.hide()
            changeSocialeRowCmp.show()
        }
    })

    // Passage au mode custom
    customSocialeCmp.on("click", function() {
        if(socialeChoiceCmp.visible()) {
            socialeChoiceCmp.hide()
            socialeInputCmp.show()
        } else {
            socialeChoiceCmp.show()
            socialeInputCmp.hide()
        }
    })

    // Mise à jour de l'input au changement sur la liste déroulante
    socialeChoiceCmp.on("update", function(cmp) {
        socialeInputCmp.value(cmp.text())
    })

    // Mise à jour de la valeur dans la feuille à l'update
    socialeInputCmp.on("update", function(cmp) {
        sheet.origineSociale.set(cmp.value())
    })

    // Affichage du label en fonction de l'origine sociale
    effect(function() {
        if(sheet.origineSociale() !== undefined && sheet.origineSociale() !== "") {
            socialeLabelCmp.value(sheet.origineSociale())
            changeSocialeRowCmp.hide()
            socialeRowCmp.show()
        } else {
            changeSocialeRowCmp.show()
            socialeRowCmp.hide()     
        }
    }, [sheet.origineSociale])

}

export const setupJeunesse = function(sheet: PavillonSheet, num: number) {

    // Définition des components
    const jeunesseTitleCmp = sheet.find("change_jeunesse_" + num) as Component<string> 
    const customJeunesseCmp = sheet.find("custom_jeunesse_" + num) as Component<string>
    const jeunesseChoiceCmp = sheet.find("jeunesse_" + num + "_choice") as ChoiceComponent<string>
    const jeunesseInputCmp = sheet.find("jeunesse_" + num + "_input") as Component<string>
    const jeunesseLabelCmp = sheet.find("jeunesse_label_" + num) as Component<string>
    const jeunesseRowCmp = sheet.find("jeunesse_" + num + "_row") as Component<null>
    const changeJeunesseRowCmp = sheet.find("change_jeunesse_" + num + "_row") as Component<null>

    // Affichage du mode édition au clic
    jeunesseTitleCmp.on("click", function() {
        if(jeunesseRowCmp.visible()) {
            jeunesseRowCmp.hide()
            changeJeunesseRowCmp.show()
        }
    })

    // Passage au mode custom
    customJeunesseCmp.on("click", function() {
        if(jeunesseChoiceCmp.visible()) {
            jeunesseChoiceCmp.hide()
            jeunesseInputCmp.show()
        } else {
            jeunesseChoiceCmp.show()
            jeunesseInputCmp.hide()
        }
    })

    // Mise à jour de l'input au changement sur la liste déroulante
    jeunesseChoiceCmp.on("update", function(cmp) {
        jeunesseInputCmp.value(cmp.text())
    })

    // Mise à jour de la valeur dans la feuille à l'update
    jeunesseInputCmp.on("update", function(cmp) {
        sheet.jeunesse[num-1].set(cmp.value())
    })

    // Affichage du label en fonction de la jeunesse
    effect(function() {
        if(sheet.jeunesse[num-1]() !== undefined && sheet.jeunesse[num-1]() !== "") {
            jeunesseLabelCmp.value(sheet.jeunesse[num-1]())
            changeJeunesseRowCmp.hide()
            jeunesseRowCmp.show()
        } else {
            changeJeunesseRowCmp.show()
            jeunesseRowCmp.hide()     
        }
    }, [sheet.jeunesse[num-1]])

}

export const setupPeuple = function(sheet: PavillonSheet) {

    // Définition des components
    const changePeupleCmp = sheet.find("change_peuple") as Component<string>
    const recordPeupleCmp = sheet.find("record_peuple") as Component<string>
    const origineRowCmp = sheet.find("origine_row") as Component<null>
    const origineChangeRowCmp = sheet.find("origine_change_row") as Component<null>
    const peupleChoiceCmp = sheet.find("peuple_choice") as ChoiceComponent<string | null>
    const customPeupleCmp = sheet.find("custom_peuple") as Component<string>
    const peupleInputCmp = sheet.find("peuple_input") as Component<string>
    const peupleLabelCmp = sheet.find("peuple_label") as Component<string>
    const peupleGroupInput = sheet.find("peuple_groupe_input") as Component<string>
    const peupleIndAfr = sheet.find("peuple_ind_afr") as Component<boolean>
    const indAfrRow = sheet.find("ind_afr_row") as Component<null>

    // Mode édition au clic
    changePeupleCmp.on("click", function() {
        if(origineRowCmp.visible()) {
            origineRowCmp.hide()
            origineChangeRowCmp.show()
            recordPeupleCmp.show()
            if(peupleChoiceCmp.value() === null) {
                peupleChoiceCmp.hide()
                peupleInputCmp.show()
                indAfrRow.show()
            } else {
                peupleChoiceCmp.show()
                peupleInputCmp.hide()
                indAfrRow.hide()
            }
        } else {
            origineRowCmp.show()
            origineChangeRowCmp.hide()
            recordPeupleCmp.hide()
        }
    })

    // Enregistrement du peuple dans la feuille a la validation
    recordPeupleCmp.on("click", function() {
        sheet.origine.set({
            id: peupleChoiceCmp.value(),
            peuple: peupleInputCmp.value(),
            groupe: peupleGroupInput.value(),
            indAfr: peupleIndAfr.value()
        })
    })

    // Effet d'affichage en fonction de l'origine enregistrée
    effect(function() {
        if(sheet.origine().peuple !== undefined && sheet.origine().peuple !== "") {
            origineRowCmp.show()
            origineChangeRowCmp.hide()
            recordPeupleCmp.hide()
            if(sheet.origine().groupe !== "") {
                peupleLabelCmp.value(sheet.origine().peuple + ' (' + sheet.origine().groupe + ')')
            } else {
                peupleLabelCmp.value(sheet.origine().peuple)
            }
        } else {
            origineRowCmp.hide()
            origineChangeRowCmp.show()
            recordPeupleCmp.show()
        }
    }, [sheet.origine])

    // Changement de l'input à l'update du choice
    peupleChoiceCmp.on("update", function(cmp) {
        peupleInputCmp.value(cmp.text())
        const id = cmp.value()
        if(id !== null) {
            peupleIndAfr.value(mapPeuple(Tables.get("peuples").get(id)).ind_afr)
        }

    })

    // Passage au mode custom au clic sur les tools
    // Note : on pass le choiceCmp à null pour ne pas enregistrer d'id
    customPeupleCmp.on("click", function() {
        if(peupleChoiceCmp.visible()) {
            peupleChoiceCmp.hide()
            peupleInputCmp.show()
            peupleChoiceCmp.value(null)
            indAfrRow.show()
        } else {
            peupleInputCmp.hide()
            peupleChoiceCmp.show()
            indAfrRow.hide()
        }
    })
}

// Fonction pour transformer une liste d'objets de la Table de profession en choix pour une liste déroulante
const professionToChoice = function(professions: ProfessionEntity[]) {
    const choices: Record<string, string> = {}
    for(let i=0; i<professions.length; i++) {
        choices[professions[i].id] = professions[i].name
    }
    return choices
}

// Récupère les signals associés au type métier a dynamiser
const getSignals = function(sheet: PavillonSheet, typeMetier: "profession" | "poste_bord") {
    if(typeMetier === "poste_bord") {
        return [sheet.posteBord.profession]
    }
    const professionSignals: Signal<Profession | undefined>[] = []
    for(let i=0; i<sheet.professions.length; i++) {
        professionSignals.push(sheet.professions[i].profession)
    }
    return professionSignals
}

// Récupère la bonne table en fonction du type de métier
const getTable = function(typeMetier: "profession" | "poste_bord") {
    if(typeMetier === "poste_bord") {
        return "postes_bord"
    }
    return "professions"
}

export const setupProfession = function(sheet: PavillonSheet, typeMetier: "profession" | "poste_bord", qte: number) {

    const professionSignals = getSignals(sheet, typeMetier)

    // Vérifie s'il y a un slot disponible pour ce type de métier
    // Si oui, on affiche le mode édition du slot, sinon on ne fait rien
    sheet.find("add_" + typeMetier).on("click", function() {
        let availableNum = 0
        for(let i=0;i<qte;i++) {
            if(professionSignals[i]() === undefined) {
                availableNum = i + 1
                break
            }
        }
        if(availableNum !== 0) {
            sheet.find("change_" + typeMetier + "_" + availableNum +  "_row").show()
        }
    })
    
    const metierTable = getTable(typeMetier)
    const professionByType: Record<string, ProfessionEntity[]> = {};
    
    // Construction du tableau des métiers groupés par type
    log("iterate metiers");
    (Tables.get("types_" + metierTable) as Table<ProfessionEntity>).each(function(val) {
        professionByType[val.id] = []
    });
    Tables.get(metierTable).each(function(val) {
        professionByType[val.type].push(val)
    });
    log("iterate done");
    // Initialisation de chaque slot
    for(let i=1; i<=qte; i++) {
        setupSingleProfession(sheet, professionByType, typeMetier, i)
    }

}

const setupSingleProfession = function(
    sheet: PavillonSheet, 
    professionByType: Record<string, ProfessionEntity[]>, 
    typeMetier: "profession" | "poste_bord", 
    num: number
    ) {

    // Définition des components
    const professionRow = sheet.find(typeMetier + "_" + num + "_row") as Component<null>
    const changeProfessionRow = sheet.find("change_" + typeMetier + "_" + num + "_row") as Component<null>
    const metierChoiceCmp = sheet.find(typeMetier + "_choice_" + num) as ChoiceComponent<string>
    const categoryChoiceCmp = sheet.find("type_" + typeMetier + "_choice_" + num) as ChoiceComponent<string>
    const metierInputCmp = sheet.find(typeMetier + "_input_" + num) as Component<string>
    const removeCmp = sheet.find("remove_" + typeMetier + "_" + num) as Component<string>
    const metierLabelCmp = sheet.find(typeMetier + "_label_" + num) as Component<string>
    const attr1Cmp = sheet.find("attr_1_" + typeMetier + "_" + num) as Component<AttributEnum>
    const attr2Cmp = sheet.find("attr_2_" + typeMetier + "_" + num) as Component<AttributEnum>
    const colListesCmp = sheet.find(typeMetier + "_" + num + "_list_col") as Component<null>
    const colCustomCmp = sheet.find(typeMetier + "_" + num + "_custom_col") as Component<null>
    const customCmp = sheet.find("custom_" + typeMetier + "_" + num) as Component<string>
    const recordCmp = sheet.find("record_" + typeMetier + "_" + num) as Component<string>
    
    // Mise d'une valeur par défaut de la catégorie
    if(categoryChoiceCmp.value() === undefined) {
        categoryChoiceCmp.value(Object.keys(professionByType)[0])
    }

    // Définition de la liste déroule des métiers en fonction de la catégorie
    const metierChoices = professionToChoice(professionByType[categoryChoiceCmp.value()])
    metierChoiceCmp.setChoices(metierChoices)
    if(metierChoices[metierChoiceCmp.value()] === undefined) {
        metierChoiceCmp.value(Object.keys(metierChoices)[0])
    }

    // Signal local pour la sélection du métier 
    const selectedProfession = signal(Tables.get(getTable(typeMetier)).get(metierChoiceCmp.value()))

    // Mise à jour de la catégorie : on change les métiers de la liste
    categoryChoiceCmp.on("update", function(cmp) {
        const professionChoices = professionToChoice(professionByType[cmp.value()]);
        metierChoiceCmp.setChoices(professionChoices)
        metierChoiceCmp.value(Object.keys(professionChoices)[0])
    })

    // Mise à jour du métier, on met à jour la profession sélectionnée
    metierChoiceCmp.on("update", function(cmp) {
        selectedProfession.set(Tables.get(getTable(typeMetier)).get(cmp.value()))
    })

    // Inscription du métier de la liste dans l'input
    effect(function() {
        metierInputCmp.value(_(selectedProfession().name))
        attr1Cmp.value(selectedProfession().attr_1)
        attr2Cmp.value(selectedProfession().attr_2)
    }, [selectedProfession])
    
    // Signal global de la feuille associé au métier du slot
    const professionSignal = getSignals(sheet, typeMetier)[num - 1]
    
    // Suppression d'un élément : on retire la profession de la feuille
    removeCmp.on("click", function() {
        professionSignal.set(undefined)
    })

    // Affichage de la profession enregistrée
    effect(function() {
        const profession = professionSignal()
        log(profession)
        if(profession === undefined) {
            removeCmp.hide()
            metierLabelCmp.value(" ")
            metierInputCmp.value("")
        } else {
            removeCmp.show()
            metierLabelCmp.value(profession.name)
        }
    }, [professionSignal])

    // Validation d'un élément, on ajoute la profession de la feuille
    recordCmp.on("click", function() {
        professionSignal.set({
            name: metierInputCmp.value(),
            attr_1: attr1Cmp.value(),
            attr_2: attr2Cmp.value(),
        })
        changeProfessionRow.hide()
    })

    // Changement d'affichage pour métier custom
    customCmp.on("click", function() {
        if(colListesCmp.visible()) {
            colCustomCmp.show()
            colListesCmp.hide()
        } else {
            colCustomCmp.hide()
            colListesCmp.show()
        }
    })
}
