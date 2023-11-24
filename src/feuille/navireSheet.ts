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
    _pSheet.armement = buildArmement()
    return _pSheet as NavireSheet
}

const buildArmement = function() {
    const armement = {} as any
    const armementByEntry = signal({}) as Signal<Record<string, ArtillerieData>>
    const calibreByEmplacement = computed(function() {
        const cal: Record<ZoneTirArtillerie, number> = {
            bordee: 0,
            chasse: 0,
            fuite: 0,
            muraille: 0,
            muraille_chasse: 0,
            muraille_fuite: 0
        }
        each(armementByEntry(), function(val) {
            cal[val.emplacement] += ((+(val.calibre) + 0.0) / 6) * val.nb_canons
            if(val.emplacement === "muraille" && val.tir_chasse) {
                cal["muraille_chasse"] += ((+(val.calibre) + 0.0) / 6) * val.nb_canons
            }
            if(val.emplacement === "muraille" && val.tir_fuite) {
                cal["muraille_fuite"] += ((+(val.calibre) + 0.0) / 6) * val.nb_canons
            }
        })
        return cal
    }, [armementByEntry]) 
    const degatsByEmplacement = computed(function() {
        const deg: Record<ZoneTirArtillerie, number> = {
            bordee: 0,
            chasse: 0,
            fuite: 0,
            muraille: 0,
            muraille_chasse: 0,
            muraille_fuite: 0
        }
        each(calibreByEmplacement(), function(val, id) {
            const actualId = id as (ZoneTirArtillerie)
            if(mesureToValeur(val) !== "-") {
                deg[actualId] = parseInt(mesureToValeur(val))
            }
        })
    }, [calibreByEmplacement])

    armement.armementByEntry = armementByEntry
    armement.calibreByEmplacement = calibreByEmplacement
    armement.degatsByemplacement = degatsByEmplacement
    return armement
}