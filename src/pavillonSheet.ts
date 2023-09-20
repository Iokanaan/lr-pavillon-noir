import { intToWord, signal } from "./utils/utils"

export const pavillonSheet = function(sheet: Sheet) {

    const _pSheet: PavillonSheet = {
        raw: function() { return sheet },
        find: function(id: string) { return sheet.get(id)},
        stringId: function() { return intToWord(sheet.getSheetId())},
        entryStates: {},
        selectedComp: signal(undefined),
        professions: [signal(undefined), signal(undefined)],
        posteBord: signal(undefined),
        attr: {},
        reputation: {
            "glo": signal(0),
            "inf": signal(0)
        }
    }
    
    return _pSheet
}