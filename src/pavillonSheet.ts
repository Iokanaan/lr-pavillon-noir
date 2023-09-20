import { intToWord, signal } from "./utils/utils"

export const pavillonSheet = function(sheet: Sheet) {

    const _pSheet: PavillonSheet = {
        raw: function() { return sheet },
        find: function(id: string) { return sheet.get(id)},
        stringId: function() { return intToWord(sheet.getSheetId())},
        entryStates: {},
        selectedComp: signal(undefined),
        professions: [signal(undefined), signal(undefined)],
        attr: {}
    }
    
    return _pSheet
}