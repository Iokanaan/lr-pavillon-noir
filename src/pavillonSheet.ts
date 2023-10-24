import { typesComp } from "./globals"
import { mapCompetence } from "./utils/mappers"
import { computed, intToWord, signal } from "./utils/utils"

export const pavillonSheet = function(sheet: Sheet) {

    const _pSheet: any = {
        raw: function() { return sheet },
        find: function(id: string) { return sheet.get(id)},
        stringId: function() { return intToWord(sheet.getSheetId())},
        entryStates: {}
    }

    // Caractéristiques / compétences
    const compSignals: any = {}
    typesComp.forEach(function(typeComp) {
        (Tables.get(typeComp) as Table<CompetenceEntity>).each(function(e) {
            const c = mapCompetence(e, typeComp)
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

    _pSheet.selectedComp = signal(undefined)
    _pSheet.attr = attrSignals
    _pSheet.comp = compSignals;


    // Détails personnels
    _pSheet.origine = signal({
            id: sheet.get("peuple_choice").value() as string,
            peuple: sheet.get("peuple_input").value() as string,
            groupe: sheet.get("peuple_groupe_input").value() as string,
    })
    _pSheet.religion = signal(sheet.get("religion_input").value() as string)
    _pSheet.titre = signal(sheet.get("titre_input").value() as string)
    log(_pSheet.titre())
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
    _pSheet.avantages = signal({} as Record<string, Avantage>)
    _pSheet.desavantages = signal({} as Record<string, Avantage>)


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

   
    // Caractéristiques secondaires
    _pSheet.chance = computed(function() {
        return _pSheet.attr["POU"]() - 5
    }, [_pSheet.attr["POU"]])

    // Présent pour ajouter des règles éventuelles qui modifierai l'initiative sans toucher à l'adaptabilité
    _pSheet.initiative = computed(function() {
        return _pSheet.attr['ADA']()
    }, [_pSheet.attr['ADA']])

    // Valeurs de métier
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

    // Modificateurs
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


    // Blessures
    _pSheet.blessures = buildBlessures(sheet)

    // Arcanes
    _pSheet.voies = []
    _pSheet.typeArcane = signal(sheet.get("type_arcarne").value())
    _pSheet.faveurs = computed(function() {
        return Math.max(_pSheet.chance() - 5, 0)
    }, [_pSheet.chance])
    for(let i=0; i<1; i++) {
        _pSheet.voies[i] = buildVoie(sheet, i+1)
    }

    return _pSheet as PavillonSheet
}

const buildVoie = function(sheet: Sheet, num: number) {
    const voie = {} as any
    voie.foi = signal(sheet.get("foi_" + num).value())
    voie.rangFoi = computed(function() {
        if(voie.foi() >= 10) {
            return 6
        }
        if(voie.foi() >= 8) {
            return 5
        }
        if(voie.foi() >= 6) {
            return 4
        }
        if(voie.foi() >= 3) {
            return 3
        }
        if(voie.foi() >= 1) {
            return 2
        }
        return 1
    }, [voie.foi])
    return voie
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

const buildBlessures = function(sheet: Sheet) {
    const blessures = {
        localisation: {
            "tete": { detail : buildDetailBlessures(sheet, "tete") },
            "torse": { detail : buildDetailBlessures(sheet, "torse") },
            "bd": { detail : buildDetailBlessures(sheet, "bd") },
            "bg": { detail : buildDetailBlessures(sheet, "bg") },
            "jd": { detail : buildDetailBlessures(sheet, "jd") },
            "jg": { detail : buildDetailBlessures(sheet, "jg") }
        }
    }  as any
    each(blessures.localisation as Record<LocalisationShortEnum, { detail: Record<BlessureEnum, Signal<boolean>[]> }>, function(d, l) {
        const loc = l as LocalisationShortEnum;
        (blessures.localisation[loc] as any).consolide = computed(function() {
            if(d.detail.mort[0]()) {
                return "mort"
            }
            if(d.detail.coma[0]() || d.detail.coma[1]()) {
                return "coma"
            }
            if(d.detail.critique[0]() || d.detail.critique[1]()) {
                return "critique"
            }
            if(d.detail.grave[0]() || d.detail.grave[1]()) {
                return "grave"
            }
            if(d.detail.serieuse[0]() || d.detail.serieuse[1]()) {
                return "serieuse"
            }
            if(d.detail.legere[0]() || d.detail.legere[1]()) {
                return "legere"
            }
            return "aucune"
        }, [
            d.detail.legere[0],
            d.detail.legere[1],
            d.detail.serieuse[0],
            d.detail.serieuse[1],
            d.detail.grave[0],
            d.detail.grave[1],
            d.detail.critique[0],
            d.detail.critique[1],
            d.detail.coma[0],
            d.detail.coma[1],
            d.detail.mort[0]
        ])
    })
    blessures.general = {}
    blessures.general.etat = computed(function() {
        const blessuresByLevel = {
            aucune:0,
            legere:0,
            serieuse:0,
            grave:0,
            critique:0,
            coma:0,
            mort:0
        }
        each(blessures.localisation, function(blessure: { "consolide": Computed<BlessureEnum>}) {
            log(blessure)
            blessuresByLevel[blessure.consolide()]++
        })
        if(blessuresByLevel.mort > 0 || blessuresByLevel.coma > 1) {
            return "mort"
        }
        if(blessuresByLevel.coma > 0 || blessuresByLevel.critique > 1) {
            return "coma"
        }
        if(blessuresByLevel.critique > 0 || blessuresByLevel.grave > 1) {
            return "critique"
        }
        if(blessuresByLevel.grave > 0) {
            return "grave"
        }
        if(blessuresByLevel.serieuse > 0) {
            return "serieuse"
        }
        if(blessuresByLevel.legere > 0) {
            return "legere"
        }
        return "aucune"
    }, [
       blessures.localisation.tete.consolide,
       blessures.localisation.torse.consolide,
       blessures.localisation.bg.consolide,
       blessures.localisation.bd.consolide,
       blessures.localisation.jg.consolide,
       blessures.localisation.jd.consolide, 
    ])

    blessures.general.malus = computed(function() {
        switch(blessures.general.etat()) {
            case "critique":
                return 4
            case "grave":
                return 2
            case "serieuse":
                return 1
        }
        return 0
    }, [blessures.general.etat])

    return blessures as {
        localisation: Record<LocalisationShortEnum, {
            detail: Record<BlessureEnum, Signal<boolean>[]>,
            consolide: Computed<BlessureEnum>
        }>,
        general: { 
            etat: Computed<BlessureEnum>,
            malus: Computed<number>   
        }
    } 
}

const buildDetailBlessures = function(sheet: Sheet, loc: LocalisationShortEnum) {
    return {
        legere: [signal(sheet.get("blessure_" + loc + "_7").value()as boolean), signal(sheet.get("blessure_" + loc + "_8").value()as boolean)],
        serieuse: [signal(sheet.get("blessure_" + loc + "_6").value()as boolean), signal(sheet.get("blessure_" + loc + "_9").value()as boolean)],
        grave: [signal(sheet.get("blessure_" + loc + "_5").value()as boolean), signal(sheet.get("blessure_" + loc + "_10").value()as boolean)],
        critique: [signal(sheet.get("blessure_" + loc + "_4").value()as boolean), signal(sheet.get("blessure_" + loc + "_11").value()as boolean)],
        coma: [signal(sheet.get("blessure_" + loc + "_3").value()as boolean), signal(sheet.get("blessure_" + loc + "_2").value()as boolean)],
        mort: [signal(sheet.get("blessure_" + loc + "_1").value()as boolean)]
    }
}