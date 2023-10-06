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

    const setValUpdateListener = function(comp: Competence) {
        const valCmp = sheet.find(comp.id + "_val") as Component<number>
        valCmp.on("update", function(cmp) {
            sheet.comp[comp.id].value.set(cmp.value())
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



export const setupOptionalGroup = function(sheet: PavillonSheet, key: string, maxSlots: number, rowHandler: (sheet: PavillonSheet, key: string, num: number) => Signal<boolean> | undefined) {

    const dependencies: Signal<boolean>[] = []
    for(let i=1; i<=maxSlots; i++) {
        const dependency = rowHandler(sheet, key, i)
        if(dependency !== undefined) {
            dependencies.push(dependency)
        }
    }

    sheet.find("add_" + key).on("click", function() {
        for(let i=1; i<=maxSlots; i++) {
            if(!sheet.find(key + "_" + i + "_val").visible()) {
                sheet.find(key + "_" + i + "_input").show()
                dependencies[i-1].set(true)
                break
            }
        }
    })

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


export const setupAttrSecondaires = function(sheet: PavillonSheet) {

    sheet.find("chance_label").on("click", function(cmp) {
        cmp.hide()
        sheet.find("chance_facilite_row").show()
    });

    (sheet.find("chance_facilite_input") as Component<string>).on("update", function(cmp) {
        if(/^[0-9]*$/.test(cmp.value())) {
            new RollBuilder(sheet.raw()).expression("1d10 < " + (parseInt(cmp.value()) + sheet.chance())).roll()
            sheet.find("chance_facilite_row").hide()
            sheet.find("chance_facilite_input").value(null)
            sheet.find("chance_label").show()
        }
    })

    effect(function() {
        log(sheet.chance())
        sheet.find("chance_val").text(sheet.chance().toString())
    }, [sheet.chance])

    effect(function() {
        sheet.find("initiative_val").text(sheet.initiative().toString())
    }, [sheet.initiative])

    each(sheet.modifiers, function(modSignal, key) {
        effect(function() {
            sheet.find(key + "_val").text(modSignal().toString())
        }, [modSignal])
    })

    each(sheet.commandement, function(cmdSignal, key) {
        effect(function() {
            sheet.find(key + "_val").text(cmdSignal().toString())
        }, [cmdSignal])
    })
}

export const setupValeurMetier = function(sheet: PavillonSheet) {

    const setDisplay = function(labelCmpId: string, valCmpId: string, subTextCmpId: string, profession: Profession | undefined) {
        log(profession)
        if(profession !== undefined) {
            sheet.find(labelCmpId).value(profession.name)
            sheet.find(subTextCmpId).value("(" + profession.attr_1 + " + " + profession.attr_2 + ") / 2")
            sheet.find(labelCmpId).show()
            sheet.find(valCmpId).show()
        } else {
            sheet.find(labelCmpId).hide()
            sheet.find(subTextCmpId).hide()
            sheet.find(valCmpId).hide()
        }
    }

    const setValue = function(valCmpId: string, value: number | undefined) {
        log(value)
        if(value !== undefined) {
            sheet.find(valCmpId).value(value.toString())
        } else {
            sheet.find(valCmpId).value("0")
        }
    }

    effect(function() {
        setDisplay( "valeur_poste_bord_label_1", "valeur_poste_bord_val_1", "poste_bord_1_subtext", sheet.posteBord.profession())
    }, [sheet.posteBord.profession])

    effect(function() {
        setValue("valeur_poste_bord_val_1", sheet.posteBord.value())
    }, [sheet.posteBord.value])

    effect(function() {
        setDisplay("valeur_metier_label_1", "valeur_metier_val_1", "metier_1_subtext", sheet.professions[0].profession())
    }, [sheet.professions[0].profession])

    effect(function() {
        setValue("valeur_metier_val_1", sheet.professions[0].value())
    }, [sheet.professions[0].value])

    effect(function() {
        setDisplay("valeur_metier_label_2", "valeur_metier_val_2", "metier_2_subtext", sheet.professions[1].profession())
    }, [sheet.professions[1].profession])

    effect(function() {
        setValue("valeur_metier_val_2", sheet.professions[1].value())
    }, [sheet.professions[1].value])
}


export const setupOptionalRow = function(sheet: PavillonSheet, key: string, num: number) {

    const row = key + "_" + num as CompetenceEnum
    log(row)
    const nameSignal = sheet.comp[row].actualName
    if(nameSignal !== undefined) {
        nameSignal.set(sheet.find(row + "_input").value() as string)
        effect(function() {
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

        const visible = signal(nameSignal() !== undefined && nameSignal() !== "")

        sheet.find(row + "_edit").on("click", function() {
            sheet.find(row + "_label").hide()
            sheet.find(row + "_edit").hide()
            sheet.find(row + "_input").show()
        })

        sheet.find(row + "_input").on("update", function(cmp) {
            cmp.hide()
            sheet.find(row + "_label").show()
            sheet.find(row +  "_edit").show()
            nameSignal.set(cmp.value() as string)
            visible.set(cmp.value() !== "" && cmp.value() !== undefined)
        })

        return visible
    }

    return undefined
}

export const setupChoiceRow = function(sheet: PavillonSheet, key: string, num: number) {

    const row = key + "_" + num as CompetenceEnum
    log(row)
    const nameSignal = sheet.comp[row].actualName
    if(nameSignal !== undefined) {
        nameSignal.set(sheet.find(row + "_input").value() as string)
        effect(function() {
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
            sheet.find(row + "_label").value(nameSignal())
        }, [nameSignal])

        const visible = signal(nameSignal() !== undefined && nameSignal() !== "")

        sheet.find(row + "_edit").on("click", function(cmp) {
            sheet.find(row + "_label").hide()
            sheet.find(row + "_edit").hide()
            sheet.find(row + "_choice").show()
        })

        sheet.find(row + "_input").on("update", function(cmp) {
            sheet.find(row + "_choice").hide()
            sheet.find(row + "_label").show()
            sheet.find(row +  "_edit").show()
            nameSignal.set(cmp.value() as string)
            visible.set(cmp.value() !== "" && cmp.value() !== undefined)
        })

        sheet.find(row + "_choice").on("update", function(cmp) {
            sheet.find(row + "_input").value(cmp.text())
        })

        return visible
    }
    return undefined
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
    
