import { typesComp } from "../globals"
import { effect, mapCompetence, resetModifiers, setVirtualBg, signal } from "../utils/utils"

export const setupComps = function(sheet: PavillonSheet) {
    const outlineSelected = function(comp: Competence) {
        const labelCmp = sheet.find(comp.id + "_label")
        const selectedComp = sheet.selectedComp()
        if(selectedComp === undefined || comp.id !== selectedComp.id) {
            labelCmp.removeClass("text-info")
        } else {
            labelCmp.addClass("text-info")
        }    
    }
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

    const setValUpdateListener = function(comp: Competence) {
        const valCmp = sheet.find(comp.id + "_val") as Component<number>
        sheet.comp[comp.id] = signal(valCmp.value())
        valCmp.on("update", function(cmp) {
            sheet.comp[comp.id].set(cmp.value())
        })
    
    }

    effect(function() {
        typesComp.forEach(function(typeComp) {
            Tables.get(typeComp).each(function(comp: CompetenceEntity) { 
                outlineSelected(mapCompetence(comp)) 
            })
        })
    }, [sheet.selectedComp])

    typesComp.forEach(function(typeComp) {
        Tables.get(typeComp).each(function(e: CompetenceEntity) { 
            const comp = mapCompetence(e)
            setSelectedComp(comp)
            setModifiers(sheet, comp)
            setValUpdateListener(comp)
        })
    })


}

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
    effect(function() {
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
    
    effect(function() {
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

    effect(function() {
        if(optinalValue() !== "") {
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

    effect(function() {
        if(optinalValue() !== "") {
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
    effect(function() {
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
    
