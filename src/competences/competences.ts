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


export const setupOptionalGroup = function(sheet: Sheet, key: string, maxSlots: number) {
    const rowVisibilities: Signal<boolean>[] = []
    for(let i=1; i<=maxSlots; i++) {
        const rowVisible = setupOptionalRow(sheet, key, i)
        rowVisibilities.push(rowVisible)
    }

    sheet.get("add_" + key).on("click", function() {
        for(let i=1; i<=maxSlots; i++) {
            if(!sheet.get(key + "_" + i + "_val").visible()) {
                sheet.get(key + "_" + i + "_input").show()
                sheet.get(key + "_" + i + "_val").show()
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
            sheet.get("add_" + key).show()
        } else {
            sheet.get("add_" + key).hide()
        }
  }, rowVisibilities)
}

const setupOptionalRow = function(sheet: Sheet, key: string, num: number) {

    const row = key + "_" + num 
    const optinalValue = signal(sheet.get(row + "_input").value())
    const rowVisible = signal(sheet.get(row + "_label").visible())

    computed(function() {
        if(optinalValue() !== "") {
            sheet.get(row + "_label").show()
            sheet.get(row + "_edit").show()
            sheet.get(row + "_val").show()
        } else {
            sheet.get(row + "_label").hide()
            sheet.get(row + "_edit").hide()
            sheet.get(row + "_val").hide()
        }
        rowVisible.set(sheet.get(row + "_label").visible())
    }, [optinalValue])

    sheet.get(row + "_edit").on("click", function(cmp) {
        sheet.get(row + "_label").hide()
        sheet.get(row + "_edit").hide()
        sheet.get(row + "_input").show()
    })

    sheet.get(row + "_input").on("update", function(cmp) {
        cmp.hide()
        sheet.get(row + "_label").show()
        sheet.get(row +  "_edit").show()
        optinalValue.set(cmp.value())
    })

    return rowVisible
}
    
