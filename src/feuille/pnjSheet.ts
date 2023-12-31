import { computed, intToWord, signal } from "../utils/utils"
import { buildBlessures } from "./pavillonSheet"

export const pnjSheet = function(sheet: Sheet) {

    const _pSheet: any = {
        raw: function() { return sheet },
        find: function(id: string) { return sheet.get(id)},
        stringId: function() { return intToWord(sheet.getSheetId())},
        entryStates: {}
    }
    // Caractéristiques / compétences
    const compSignals: any = {}
    each((sheet.get("competences_repeater") as Component<Record<string, CompPnjData>>).value(), function(val, id) {
        compSignals[val.comp] = signal(sheet.get("competences_repeater").find(id).value().comp)
    })
    _pSheet.comp = compSignals

    const attrSignals: any = {}
    Tables.get("attributs").each(function(a) {
        attrSignals[a.id] = signal(sheet.get(a.id + "_val").value())
    })
    _pSheet.selectedComp = signal(undefined)
    _pSheet.attr = attrSignals

    // Détails personnels
    _pSheet.origine = signal({
            id: sheet.get("peuple_choice").value() as string,
            peuple: sheet.get("peuple_input").value() as string,
            groupe: sheet.get("peuple_groupe_input").value() as string,
    })
    _pSheet.religion = signal(sheet.get("religion_input").value() as string)
    _pSheet.titre = signal(sheet.get("titre_input").value() as string)
    _pSheet.origineSociale = signal(sheet.get("origine_sociale_input").value() as string)
    _pSheet.jeunesse = [signal(sheet.get("jeunesse_1_input").value() as string), signal(sheet.get("jeunesse_2_input").value() as string)]
    _pSheet.professions = [buildProfession(_pSheet, sheet, "profession", 1), buildProfession(_pSheet, sheet, "profession", 2)]
    _pSheet.posteBord = buildProfession(_pSheet, sheet, "poste_bord", 1)
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

    // Réputation
    _pSheet.reputation = {
        glo: {
            score: signal(sheet.get("glo_points").value() as number)
        },
        inf: {
            score: signal(sheet.get("inf_points").value() as number)
        } 
    }   

    _pSheet.reputation.glo.level = reputationLevel(_pSheet.reputation.glo.score) 
    _pSheet.reputation.inf.level = reputationLevel(_pSheet.reputation.inf.score)

    // Présent pour ajouter des règles éventuelles qui modifierai l'initiative sans toucher à l'adaptabilité
    _pSheet.initiative = computed(function() {
        return _pSheet.attr['ADA']()
    }, [_pSheet.attr['ADA']])

    // Blessures
    _pSheet.blessures = buildBlessures(sheet)

    return _pSheet as PnjSheet
}

const buildProfession = function(_pSheet: {"attr": Record<AttributEnum, Signal<number>>}, sheet: Sheet, professionId: string, num: number): ProfessionHolder {
    let initialData = undefined
    if(sheet.get(professionId + "_input_" + num).value() !== "" && sheet.get(professionId + "_input_" + num).value() !== undefined) {
        initialData = {
            name: sheet.get(professionId + "_input_" + num).value(),
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


const reputationLevel = function(reputationScore: Signal<number>) {
    return computed(function() {
        const rep = reputationScore() 
        if(rep < 50) {
            return 0
        }
        if(rep < 100) {
            return 1
        }
        if(rep < 150) {
            return 2
        }
        if(rep < 200) {
            return 3
        }
        if(rep < 300) {
            return 4
        }
        if(rep < 500) {
            return 5
        }
        if(rep < 1000) {
            return 6
        }
        if(rep < 2000) {
            return 7
        }
        if(rep < 5000) {
            return 8
        }
        if(rep < 10000) {
            return 9
        }
        return 10
    }, [reputationScore])
}