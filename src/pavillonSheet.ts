import { computed, intToWord, signal } from "./utils/utils"

export const pavillonSheet = function(sheet: Sheet) {

    const _pSheet: PavillonSheet = {
        raw: function() { return sheet },
        find: function(id: string) { return sheet.get(id)},
        stringId: function() { return intToWord(sheet.getSheetId())},
        entryStates: {},
        selectedComp: signal(undefined),
        professions: [signal(undefined), signal(undefined)],
        posteBord: signal(undefined),
        attr: {
            'FOR': signal(0),
            'RES': signal(0),
            'ADA': signal(0),
            'ADR': signal(0),
            'ERU': signal(0),
            'PER': signal(0),
            'EXP': signal(0),
            'CHA': signal(0),
            'POU': signal(0),
        },
        comp: {},
        reputation: {
            "glo": signal(0),
            "inf": signal(0)
        }
    }

    _pSheet.chance = computed(function() {
        return _pSheet.attr["POU"]() - 5
    }, [_pSheet.attr["POU"]])

    _pSheet.commandement = {

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