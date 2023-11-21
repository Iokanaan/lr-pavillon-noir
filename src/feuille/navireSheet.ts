import { intToWord, signal } from "../utils/utils"

export const navireSheet = function(sheet: Sheet) {

    const _pSheet: any = {
        raw: function() { return sheet },
        find: function(id: string) { return sheet.get(id)},
        stringId: function() { return intToWord(sheet.getSheetId())},
        entryStates: {}
    }
    return _pSheet
}