import { mesureToValeur } from "../navire/convertisseur"
import { computed, intToWord, signal } from "../utils/utils"

export const navireSheet = function(sheet: Sheet) {

    const _pSheet: any = {
        raw: function() { return sheet },
        find: function(id: string) { return sheet.get(id)},
        stringId: function() { return intToWord(sheet.getSheetId())},
        entryStates: {}
    }
    _pSheet.mature = {
        artimon: signal(sheet.get("use_artimon").value()),
        misaine: signal(sheet.get("use_misaine").value()),
        mat: signal(sheet.get("use_mat").value())
    }
    _pSheet.armement = buildArmement(sheet)
    _pSheet.equipage = buildEquipage(sheet, _pSheet.armement.armementByEmplacement)
    _pSheet.structure = buildStructure(sheet)
    return _pSheet as NavireSheet
}

const buildStructure = function(sheet: Sheet) {
    const psCoqueMax = signal(sheet.get("structure_coque_input").value() as number)
    const psMatMax = signal(sheet.get("structure_mat_input").value() as number)
    const coqueBabord = signal(sheet.get("structure_coque_babord_input").value() as number)
    const coqueTribord = signal(sheet.get("structure_coque_tribord_input").value() as number)
    const coqueProue = signal(sheet.get("structure_coque_proue_input").value() as number)
    const coquePoupe = signal(sheet.get("structure_coque_poupe_input").value() as number)
    const grandMat = signal(sheet.get("structure_grand_mat_input").value() as number)
    const misaine = signal(sheet.get("structure_misaine_input").value() as number)
    const artimon = signal(sheet.get("structure_artimon_input").value() as number)

    const degatProcessor = function(actual: number, max: number) {
        const ratio = actual / max
        log(ratio)
        if(ratio >= 1) {
            return "Intact"
        }
        if(ratio >= 0.8) {
            return "Léger"
        }
        if(ratio >= 0.6) {
            return "Sérieux"
        }
        if(ratio >= 0.4) {
            return "Grave"
        }
        if(ratio >= 0.2) {
            return "Critique"
        }
        return "Ravagé"
    }

    const degatsCoqueBabord = computed(function() {
        return degatProcessor(coqueBabord(), psCoqueMax())
    }, [psCoqueMax, coqueBabord])

    const degatsCoqueTribord = computed(function() {
        return degatProcessor(coqueTribord(), psCoqueMax())
    }, [psCoqueMax, coqueTribord])

    const degatsCoquePoupe = computed(function() {
        return degatProcessor(coquePoupe(), psCoqueMax())
    }, [psCoqueMax, coquePoupe])

    const degatsCoqueProue = computed(function() {
        return degatProcessor(coqueProue(), psCoqueMax())
    }, [psCoqueMax, coqueProue])

    const degatsGrandMat = computed(function() {
        return degatProcessor(grandMat(), psMatMax())
    }, [psMatMax, grandMat])

    const degatsArtimon = computed(function() {
        return degatProcessor(artimon(), psMatMax())
    }, [psMatMax, artimon])

    const degatsMisaine = computed(function() {
        return degatProcessor(misaine(), psMatMax())
    }, [psMatMax, misaine])

    const degatsMatureComputed = computed(function() {
        const degatsByLevel = {
            "Ok": 0,
            "Léger": 0,
            "Sérieux": 0,
            "Grave": 0,
            "Critique": 0,
            "Ravagé": 0
        }
        degatsByLevel[degatsArtimon()]++
        degatsByLevel[degatsGrandMat()]++
        degatsByLevel[degatsMisaine()]++
        if(degatsByLevel["Ravagé"] > 0 || degatsByLevel["Critique"] > 1) {
            return "Ravagé"
        }
        if(degatsByLevel["Critique"] > 0 || degatsByLevel["Grave"] > 1) {
            return "Critique"
        }
        if(degatsByLevel["Grave"] > 0 || degatsByLevel["Sérieux"] > 1) {
            return "Grave"
        }
        if(degatsByLevel["Sérieux"] > 0 || degatsByLevel["Léger"] > 1) {
            return "Sérieux"
        }
        if(degatsByLevel["Léger"] > 0) {
            return "Léger"
        }
        return "Ok"
    }, [degatsArtimon, degatsGrandMat, degatsMisaine])

    const structure = {
        maxCoque: psCoqueMax,
        maxMat: psMatMax,
        degatsMature: degatsMatureComputed,
        coque: {
            babord: { ps: coqueBabord, degats: degatsCoqueBabord },
            tribord: { ps: coqueTribord, degats: degatsCoqueTribord },
            proue: { ps: coqueProue, degats: degatsCoqueProue },
            poupe: { ps: coquePoupe, degats: degatsCoquePoupe },
        },
        mat: {
            mat: { ps: grandMat, degats: degatsGrandMat },
            misaine: { ps: misaine, degats: degatsMisaine },
            artimon: { ps: artimon, degats: degatsArtimon },
        },
    } as any
    return structure
}

const buildEquipage = function(sheet: Sheet, armementByEmplacement: Computed<Record<ZoneTirArtillerie, { nbCanons: number, degats: number, degatsValeur: string, pertes: number, pertesValeur: string, portee: string, nbHommes: number }>>) {
    const equipage = {} as any
    equipage.maxi = signal(sheet.get("equipe_maxi_input").value() as number)
    equipage.miniManoeuvre = signal(sheet.get("mini_manoeuvre_input").value() as number)
    equipage.miniRecharge = computed(function() {
        const nbHommes = [0]
        each(armementByEmplacement(), function(val, id) {
            if(id !== "muraille_chasse" && id !== "muraille_fuite") {
                nbHommes[0] += val.nbHommes
            }
        })
        return nbHommes[0]
    }, [armementByEmplacement])
    equipage.actuel = signal(sheet.get("equipe_actuel_input").value() as number)
    return equipage
}

const buildArmement = function(sheet: Sheet) {
    const armement = {} as any
    const armementByEntry = signal({}) as Signal<Record<string, ArtillerieData>>
    const typeBouletByEmplacement: Signal<Record<ZoneTirArtillerie, string>> = signal({
        bordee: sheet.get("bordee_charge").value(),
        fuite: sheet.get("fuite_charge").value(),
        chasse: sheet.get("chasse_charge").value(),
        muraille: sheet.get("muraille_charge").value(),
        muraille_chasse: sheet.get("muraille_chasse_charge").value(),
        muraille_fuite: sheet.get("muraille_fuite_charge").value()
    })
    const armementByEmplacement = computed(function() {
        const cal: Record<ZoneTirArtillerie, { nbCanons: number, degats: number, degatsValeur: string, pertes: number, pertesValeur: string, portee: string, nbHommes: number }> = {
            bordee: { nbCanons: 0, degats: 0, degatsValeur: "-", pertes: 0, pertesValeur: "-", portee: "300m", nbHommes: 0},
            chasse: { nbCanons: 0, degats: 0, degatsValeur: "-", pertes: 0, pertesValeur: "-", portee: "300m", nbHommes: 0 },
            fuite: { nbCanons: 0, degats: 0, degatsValeur: "-", pertes: 0, pertesValeur: "-", portee: "300m", nbHommes: 0 },
            muraille: { nbCanons: 0, degats: 0, degatsValeur: "-", pertes: 0, pertesValeur: "-", portee: "300m", nbHommes: 0 },
            muraille_chasse: { nbCanons: 0, degats: 0, degatsValeur: "-", pertes: 0, pertesValeur: "-", portee: "300m", nbHommes: 0 },
            muraille_fuite: { nbCanons: 0, degats: 0, degatsValeur: "-", pertes: 0, pertesValeur: "-", portee: "300m", nbHommes: 0 },
        }
        each(armementByEntry(), function(val) {
            cal[val.emplacement].nbCanons += val.nb_canons
            cal[val.emplacement].degats += ((+(val.calibre) + 0.0) / 6) * val.nb_canons
            cal[val.emplacement].pertes += ((+(val.pertes) + 0.0) / 6) * val.nb_canons
            cal[val.emplacement].nbHommes += val.nb_hommes
            if(val.emplacement === "muraille" && val.tir_chasse) {
                cal["muraille_chasse"].degats += ((+(val.calibre) + 0.0) / 6) * val.nb_canons
                cal["muraille_chasse"].pertes += ((+(val.pertes) + 0.0) / 6) * val.nb_canons
            }
            if(val.emplacement === "muraille" && val.tir_fuite) {
                cal["muraille_fuite"].degats += ((+(val.calibre) + 0.0) / 6) * val.nb_canons
                cal["muraille_fuite"].pertes += ((+(val.pertes) + 0.0) / 6) * val.nb_canons
            }
        })
        each(cal, function(val, id) {
            const actualId = id as (ZoneTirArtillerie)
            if(mesureToValeur(val.degats) !== "-") {
                if(typeBouletByEmplacement()[actualId] === "mitraille") {
                    cal[actualId].degats = 0
                }
                cal[actualId].degatsValeur = mesureToValeur(val.degats)
            }
            if(typeBouletByEmplacement()[actualId] !== "mitraille") {
                cal[actualId].pertes = cal[actualId].degats
            }
            cal[actualId].pertesValeur = mesureToValeur(cal[actualId].pertes)
            switch(actualId) {
                case "bordee":
                    if(typeBouletByEmplacement()[actualId] === "boulet") {
                        cal[actualId].portee = _("300m")
                    } else if(typeBouletByEmplacement()[actualId] === "boulet_rame") {
                        cal[actualId].portee = _("150m")
                    } else {
                        cal[actualId].portee = _("50m")
                    }
                    break;
                case "chasse":
                case "fuite":
                    if(typeBouletByEmplacement()[actualId] === "boulet") {
                        cal[actualId].portee = _("400m")
                    } else if(typeBouletByEmplacement()[actualId] === "boulet_rame") {
                        cal[actualId].portee = _("200m")
                    } else {
                        cal[actualId].portee = _("50m")
                    }
                    break;
                case "muraille":
                case "muraille_chasse":
                case "muraille_fuite":
                    if(typeBouletByEmplacement()[actualId] === "boulet") {
                        cal[actualId].portee = _("50m")
                    } else {
                        cal[actualId].portee = _("Abord.")
                    }
                    break;
            }
        })
        log(cal)
        return cal
    }, [armementByEntry, typeBouletByEmplacement]) 
    const tonnage = computed(function() {
        const tonnageTotal = [0]
        each(armementByEntry(), function(val) {
            tonnageTotal[0] += val.tonnage
        })
        return tonnageTotal[0]
    }, [armementByEntry])
    armement.armementByEntry = armementByEntry
    armement.typeBouletByEmplacement = typeBouletByEmplacement
    armement.armementByEmplacement = armementByEmplacement
    armement.tonnage = tonnage
    return armement
}