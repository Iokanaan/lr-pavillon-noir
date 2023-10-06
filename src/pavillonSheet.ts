import { typesComp } from "./globals"
import { computed, intToWord, mapCompetence, signal } from "./utils/utils"

export const pavillonSheet = function(sheet: Sheet) {

    const compSignals: any = {}
    typesComp.forEach(function(typeComp) {
        (Tables.get(typeComp) as Table<CompetenceEntity>).each(function(e) {
            const c = mapCompetence(e)
            if(!c.optional) {
                compSignals[c.id] = { 
                    value: signal(sheet.get(c.id + "_val").value())
                } 
            } else {
                compSignals[c.id] = { 
                    value: signal(sheet.get(c.id + "_val").value()), 
                    actualName: signal(sheet.get(c.id + "_label").value())
                } 
            }
        })
    })

    const attrSignals: any = {}
    Tables.get("attributs").each(function(a) {
        attrSignals[a.id] = signal(sheet.get(a.id + "_val").value())
    })

    const _pSheet: any = {
        raw: function() { return sheet },
        find: function(id: string) { return sheet.get(id)},
        stringId: function() { return intToWord(sheet.getSheetId())},
        entryStates: {},
        selectedComp: signal(undefined),
        attr: attrSignals,
        comp: compSignals,
        origine: signal({
            id: sheet.get("peuple_choice").value(),
            peuple: sheet.get("peuple_input").value(),
            groupe: sheet.get("peuple_groupe_input").value(),
        }),
        religion: signal(sheet.get("religion_input").value() as string),
        titre: signal(sheet.get("titre_input").value()),
        reputation: {
            glo: signal(sheet.get("glo_points").value()),
            inf: signal(sheet.get("inf_points").value())
        }
    }

    if(/^[0-9]*$/.test(sheet.get("taille_input").value())) {
        _pSheet.taille = signal(parseInt(sheet.get("taille_input").value()))
    } else {
        _pSheet.taille = signal(undefined)
    }

    if(/^[0-9]*$/.test(sheet.get("age_input").value())) {
        _pSheet.age = signal(parseInt(sheet.get("age_input").value()))
    } else {
        _pSheet.age = signal(undefined)
    }

    if(/^[0-9]*$/.test(sheet.get("poids_input").value())) {
        _pSheet.poids = signal(parseInt(sheet.get("poids_input").value()))
    } else {
        _pSheet.poids = signal(undefined)
    }

    _pSheet.professions = [buildProfession(_pSheet, sheet, "profession", 1), buildProfession(_pSheet, sheet, "profession", 2)]
    _pSheet.posteBord = buildProfession(_pSheet, sheet, "poste_bord", 1)
    log(_pSheet.professions)
    _pSheet.chance = computed(function() {
        log("process chance")
        return _pSheet.attr["POU"]() - 5
    }, [_pSheet.attr["POU"]])

    // Présent pour ajouter des règles éventuelles qui modifierai l'initiative sans toucher à l'adaptabilité
    _pSheet.initiative = computed(function() {
        return _pSheet.attr['ADA']()
    }, [_pSheet.attr['ADA']])

    _pSheet.commandement = {
        "capitaine": computed(function() {
            return Math.round((_pSheet.attr['CHA']() + _pSheet.attr['ERU']()) / 2)
        }, [_pSheet.attr["CHA"], _pSheet.attr["ERU"]]),
        "second": computed(function() {
            return Math.round((_pSheet.attr['ADA']() + _pSheet.attr['EXP']()) / 2)
        }, [_pSheet.attr["ADA"], _pSheet.attr["EXP"]]),
        "canonnier": computed(function() {
            return Math.round((_pSheet.attr['PER']() + _pSheet.attr['EXP']()) / 2)
        }, [_pSheet.attr["PER"], _pSheet.attr["EXP"]]),
        "quartier_maitre": computed(function() {
            return Math.round((_pSheet.attr['PER']() + _pSheet.attr['CHA']()) / 2)
        }, [_pSheet.attr["PER"], _pSheet.attr["CHA"]]),
        "maitre_equipage": computed(function() {
            return Math.round((_pSheet.attr['ADR']() + _pSheet.attr['EXP']()) / 2)
        }, [_pSheet.attr["ADR"], _pSheet.attr["EXP"]]),
        "maitre_canonnier": computed(function() {
            return Math.round((_pSheet.attr['PER']() + _pSheet.attr['FOR']()) / 2)
        }, [_pSheet.attr["PER"], _pSheet.attr["FOR"]])
    }

    _pSheet.modifiers = {
        "MDFor": computed(function() {
            const force = _pSheet.attr['FOR']()
            if(force <= 2) {
                return -2
            }
            if(force === 3) {
                return -1
            }
            if(force <= 5) {
                return 0
            }
            if(force <= 7) {
                return 1
            }
            if(force === 8) {
                return 2
            }
            return 3
        }, [_pSheet.attr['FOR']]),
        "MDAdr": computed(function() {
            const adresse = _pSheet.attr['ADR']()
            if(adresse <= 3) {
                return -1
            }
            if(adresse <= 6) {
                return 0
            }
            if(adresse <= 8) {
                return 1
            }
            return 2
        }, [_pSheet.attr['ADR']])
    }
    
    return _pSheet as PavillonSheet
}

const buildProfession = function(_pSheet: {"attr": Record<AttributEnum, Signal<number>>}, sheet: Sheet, professionId: string, num: number): ProfessionHolder {
    let initialData = undefined
    if(sheet.get(professionId + "_label_" + num).value() !== "" && sheet.get(professionId + "_label_" + num).value() !== undefined) {
        initialData = {
            name: sheet.get(professionId + "_label_" + num).value(),
            attr_1: sheet.get("attr_1_" + professionId + "_" + num).value(),
            attr_2: sheet.get("attr_2_" + professionId + "_" + num).value()
        }
    }
    const holder = { "profession": signal(initialData) as Signal<Profession | undefined> };
    (holder as any).value = computed(function() {
        const profession = holder.profession()
        if(profession !== undefined) {
            return Math.round((_pSheet.attr[profession.attr_1]() + _pSheet.attr[profession.attr_2]()) / 2)
        }
        return undefined
    }, [
        holder.profession, 
        _pSheet.attr['ADA'], 
        _pSheet.attr['FOR'], 
        _pSheet.attr['ADR'], 
        _pSheet.attr['PER'], 
        _pSheet.attr['EXP'], 
        _pSheet.attr['CHA'], 
        _pSheet.attr['POU'],
        _pSheet.attr['RES'],
        _pSheet.attr['ERU']
    ])
    return holder as ProfessionHolder
}