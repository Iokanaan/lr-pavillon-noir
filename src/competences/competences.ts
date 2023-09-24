import { computed, mapCompetence, signal } from "../utils/utils"

export const setupRollSelection = function(sheet: PavillonSheet) {
    const outlineSelected = function(comp: Competence) {
        const selectedComp = sheet.selectedComp()
        if(selectedComp === undefined || comp.id !== selectedComp.id) {
            sheet.find(comp.id + "_label").removeClass("text-info")
        } else {
            sheet.find(comp.id + "_label").addClass("text-info")
        }    
    }
    const setSelectedComp = function(comp: Competence) {
        const selectedComp = sheet.selectedComp()
        sheet.find(comp.id + "_label").on("click", function(cmp) {
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
    computed(function() {
        Tables.get("comp_maritimes").each(function(comp: CompetenceEntity) { outlineSelected(mapCompetence(comp)) })
        Tables.get("comp_connaissances").each(function(comp: CompetenceEntity) { outlineSelected(mapCompetence(comp)) })
        Tables.get("comp_techniques").each(function(comp: CompetenceEntity) { outlineSelected(mapCompetence(comp)) })
        Tables.get("comp_physiques").each(function(comp: CompetenceEntity) { outlineSelected(mapCompetence(comp)) })
        Tables.get("comp_sociales").each(function(comp: CompetenceEntity) { outlineSelected(mapCompetence(comp)) })
    }, [sheet.selectedComp])
    Tables.get("comp_maritimes").each(function(comp: CompetenceEntity) { setSelectedComp(mapCompetence(comp)) })
    Tables.get("comp_connaissances").each(function(comp: CompetenceEntity) { setSelectedComp(mapCompetence(comp)) })
    Tables.get("comp_techniques").each(function(comp: CompetenceEntity) { setSelectedComp(mapCompetence(comp)) })
    Tables.get("comp_physiques").each(function(comp: CompetenceEntity) { setSelectedComp(mapCompetence(comp)) })
    Tables.get("comp_sociales").each(function(comp: CompetenceEntity) { setSelectedComp(mapCompetence(comp)) })
}


export const setupOptionalGroup = function(sheet: PavillonSheet, key: string, maxSlots: number) {
    const rowVisibilities: Signal<boolean>[] = []
    for(let i=1; i<=maxSlots; i++) {
        const rowVisible = setupOptionalRow(sheet, key, i)
        rowVisibilities.push(rowVisible)
    }

    sheet.find("add_" + key).on("click", function() {
        for(let i=1; i<=maxSlots; i++) {
            if(!sheet.find(key + "_" + i + "_val").visible()) {
                sheet.find(key + "_" + i + "_input").show()
                rowVisibilities[i-1].set(true)
                break
            }
        }
    })
    computed(function() {
        let slotsLeft = false
        for(let i=0; i<rowVisibilities.length; i++) {
            slotsLeft = slotsLeft || !rowVisibilities[i]() 
        }
        if(slotsLeft) {
            sheet.find("add_" + key).show()
        } else {
            sheet.find("add_" + key).hide()
        }
  }, rowVisibilities)
}

export const setupChoiceGroup = function(sheet: PavillonSheet, key: string, maxSlots: number) {
    const rowVisibilities: Signal<boolean>[] = []
    for(let i=1; i<=maxSlots; i++) {
        const rowVisible = setupChoiceRow(sheet, key, i)
        rowVisibilities.push(rowVisible)
    }

    sheet.find("add_" + key).on("click", function() {
        for(let i=1; i<=maxSlots; i++) {
            if(!sheet.find(key + "_" + i + "_val").visible()) {
                sheet.find(key + "_" + i + "_choice").show()
                rowVisibilities[i-1].set(true)
                break
            }
        }
    })
    computed(function() {
        let slotsLeft = false
        for(let i=0; i<rowVisibilities.length; i++) {
            slotsLeft = slotsLeft || !rowVisibilities[i]() 
        }
        if(slotsLeft) {
            sheet.find("add_" + key).show()
        } else {
            sheet.find("add_" + key).hide()
        }
  }, rowVisibilities)
}


const setupOptionalRow = function(sheet: PavillonSheet, key: string, num: number) {

    const row = key + "_" + num 
    const optinalValue = signal(sheet.find(row + "_input").value())
    const rowVisible = signal(sheet.find(row + "_label").visible())

    computed(function() {
        if(optinalValue() !== "") {
            sheet.find(row + "_label").show()
            sheet.find(row + "_edit").show()
            sheet.find(row + "_val").show()
            sheet.find(row + "_xp").show()
            sheet.find(row + "_pratique").show()
        } else {
            sheet.find(row + "_label").hide()
            sheet.find(row + "_edit").hide()
            sheet.find(row + "_val").hide()
            sheet.find(row + "_xp").hide()
            sheet.find(row + "_pratique").hide()
        }
        rowVisible.set(sheet.find(row + "_label").visible())
    }, [optinalValue])

    sheet.find(row + "_edit").on("click", function(cmp) {
        sheet.find(row + "_label").hide()
        sheet.find(row + "_edit").hide()
        sheet.find(row + "_input").show()
    })

    sheet.find(row + "_input").on("update", function(cmp) {
        cmp.hide()
        sheet.find(row + "_label").show()
        sheet.find(row +  "_edit").show()
        optinalValue.set(cmp.value())
    })

    return rowVisible
}

const setupChoiceRow = function(sheet: PavillonSheet, key: string, num: number) {

    const row = key + "_" + num 
    const optinalChoice = signal(sheet.find(row + "_choice").value())
    const optinalValue = signal(sheet.find(row + "_input").value())
    const rowVisible = signal(sheet.find(row + "_label").visible())

    log(optinalChoice())

    computed(function() {
        if(optinalValue() !== "") {
            sheet.find(row + "_label").show()
            sheet.find(row + "_edit").show()
            sheet.find(row + "_val").show()
            sheet.find(row + "_xp").show()
            sheet.find(row + "_pratique").show()
        } else {
            sheet.find(row + "_label").hide()
            sheet.find(row + "_edit").hide()
            sheet.find(row + "_val").hide()
            sheet.find(row + "_xp").hide()
            sheet.find(row + "_pratique").hide()
        }
        sheet.find(row + "_label").value(optinalValue())
        rowVisible.set(sheet.find(row + "_label").visible())
    }, [optinalValue])

    sheet.find(row + "_edit").on("click", function(cmp) {
        sheet.find(row + "_label").hide()
        sheet.find(row + "_edit").hide()
        sheet.find(row + "_choice").show()
    })

    sheet.find(row + "_input").on("update", function(cmp) {
        sheet.find(row + "_choice").hide()
        sheet.find(row + "_label").show()
        sheet.find(row +  "_edit").show()
        optinalValue.set(cmp.value())
    })

    sheet.find(row + "_choice").on("update", function(cmp) {
        sheet.find(row + "_input").value(cmp.text())
    })

    return rowVisible
}

export const setupDisplayedReputationPoints = function(sheet: PavillonSheet, typeRep: "glo" | "inf") {
    computed(function() {
        const reputation = sheet.reputation[typeRep]()
        for(let i=1;i<=10; i++) {
            if(reputation >= i) {
                sheet.find(typeRep + "_" + i).show()
            } else {
                sheet.find(typeRep + "_" + i).hide()
            }
        }
    }, [sheet.reputation[typeRep]])
}
    
