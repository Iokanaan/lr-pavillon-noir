import { typesComp } from "../globals"
import { mapCompetence } from "../utils/mappers"
import { effect, setVirtualBg, signal } from "../utils/utils"

export const setupComps = function(sheet: PavillonSheet) {

    // Système de sélection au clic de la compétence
    // Enregistrement de la compétence sélectionnée dans la feuille
    const setSelectedComp = function(comp: Competence) {
        const labelCmp = sheet.find(comp.id + "_label")
        const selectedComp = sheet.selectedComp()
        labelCmp.on("click", function(cmp) {
            if(selectedComp === undefined || selectedComp.id !== comp.id) {
                if(comp.name === undefined) {
                    comp.name = cmp.text()
                }
                sheet.selectedComp.set(comp)
            } else {
                sheet.selectedComp.set(undefined)
            }
        })
    }

    // Système de modificateurs +/-
    const setModifiers = function(sheet: PavillonSheet, comp: Competence) {
        sheet.find(comp.id + "_plus").on("click", function() {
            const compCmp = sheet.find(comp.id + "_val") as Component<number>
            compCmp.virtualValue(compCmp.value() + 1)
            setVirtualBg(compCmp)
        })
        sheet.find(comp.id + "_minus").on("click", function() {
            const compCmp = sheet.find(comp.id + "_val") as Component<number>
            if(compCmp.value() > 0) {
                compCmp.virtualValue(compCmp.value() - 1)
                setVirtualBg(compCmp)
            }
        })
    }

    // Mise à jour dans les signaux quand la compétence change de valeur
    const setValUpdateListener = function(comp: Competence) {
        const valCmp = sheet.find(comp.id + "_val") as Component<number>
        valCmp.on("update", function(cmp) {
            sheet.comp[comp.id].value.set(cmp.value())
        })
    }

    // Effet de surlignage quand une compétence est sélectionnée
    effect(function() {
        typesComp.forEach(function(typeComp) {
            Tables.get(typeComp).each(function(comp: CompetenceEntity) { 
                const labelCmp = sheet.find(comp.id + "_label")
                const selectedComp = sheet.selectedComp()
                if(selectedComp === undefined || comp.id !== selectedComp.id) {
                    labelCmp.removeClass("text-info")
                } else {
                    labelCmp.addClass("text-info")
                }    
            })
        })
    }, [sheet.selectedComp])

    // Boucler pour exécuter tous les fonctions précédentes sur toutes les compéteces
    typesComp.forEach(function(typeComp) {
        Tables.get(typeComp).each(function(e: CompetenceEntity) { 
            const comp = mapCompetence(e, typeComp)
            setSelectedComp(comp)
            setModifiers(sheet, comp)
            setValUpdateListener(comp)
        })
    })


}

export const getOptionalCompType = function(comp: string) {
    return ["arme_blanche", "arme_trait"].indexOf(comp) !== -1 ? "choice" : "input"
}

export const setupOptionalGroup = function(sheet: PavillonSheet, key: string, maxSlots: number, type: "input" | "choice") {

    // Initialisation de chaque ligne, recupération d'un signal de visibilité
    const dependencies: Signal<boolean>[] = []
    for(let i=1; i<=maxSlots; i++) {
        const dependency = setupOptionalRow(sheet, key, type, i)
        if(dependency !== undefined) {
            dependencies.push(dependency)
        }
    }

    // Au clic sur add, cherche le prochain slot disponible et on l'affiche
    sheet.find("add_" + key).on("click", function() {
        for(let i=1; i<=maxSlots; i++) {
            if(!sheet.find(key + "_" + i + "_val").visible()) {
                if(type === "choice") {
                    sheet.find(key + "_" + i + "_choice").show()
                } else {
                    sheet.find(key + "_" + i + "_input").show()
                }
                dependencies[i-1].set(true)
                break
            }
        }
    })

    // Cacher le bouton add quand tous les slots sont occupés
    effect(function() {
        let slotsLeft = false
        for(let i=0; i<dependencies.length; i++) {
            slotsLeft = slotsLeft || !dependencies[i]() 
        }
        if(slotsLeft) {
            sheet.find("add_" + key).show()
        } else {
            sheet.find("add_" + key).hide()
        }
  }, dependencies)
}

// Paramétrage des compétences dynamiques
const setupOptionalRow = function(sheet: PavillonSheet, key: string, type: "input" | "choice", num: number) {

    const row = key + "_" + num as CompetenceEnum
    const nameSignal = sheet.comp[row].actualName
    // Uniquement si la compétence est dynamique
    if(nameSignal !== undefined) {
        nameSignal.set(sheet.find(row + "_input").value() as string)
        effect(function() {
            sheet.find(row + "_input").hide()
            if(type === "choice") {
                sheet.find(row + "_choice").hide()
            }
            sheet.find(row + "_label").value(nameSignal())
            sheet.find(row + "_label").show()
            sheet.find(row +  "_edit").show()
            if(nameSignal() !== "") {
                sheet.find(row + "_label").show()
                sheet.find(row + "_edit").show()
                sheet.find(row + "_val").show()
                sheet.find(row + "_xp").show()
                sheet.find(row + "_pratique").show()
                sheet.find(row + "_plus").show()
                sheet.find(row + "_minus").show()
            } else {
                sheet.find(row + "_label").hide()
                sheet.find(row + "_edit").hide()
                sheet.find(row + "_val").hide()
                sheet.find(row + "_xp").hide()
                sheet.find(row + "_pratique").hide()
                sheet.find(row + "_plus").hide()
                sheet.find(row + "_minus").hide()
            }
        }, [nameSignal])

        // Signal local pour savoir si la compétence est visible
        const visible = signal(nameSignal() !== undefined && nameSignal() !== "")

        // Gestion du clic sur le bouton edit
        sheet.find(row + "_edit").on("click", function() {
            sheet.find(row + "_label").hide()
            sheet.find(row + "_edit").hide()
            if(type === "choice") {
                sheet.find(row + "_choice").show()
            } else {
                sheet.find(row + "_input").show()
            }
        })

        // Sur la mise à jour de l'input, on cache le mode édition, on affiche le label si défini
        sheet.find(row + "_input").on("update", function(cmp) {
            nameSignal.set(cmp.value() as string)
            visible.set(cmp.value() !== "" && cmp.value() !== undefined)
        })

        // En mode choice, on met a jour l'input associé
        if(type === "choice") {
            sheet.find(row + "_choice").on("update", function(cmp) {
                sheet.find(row + "_input").value(cmp.text())
            })
        }

        return visible
    }

    return undefined
}


