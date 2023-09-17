import { intToWord, signal } from "./utils/utils"

export const pavillonSheet = function(sheet: Sheet) {

    const _pSheet: PavillonSheet = {} as any
    _pSheet.raw = function() { return sheet } 
    _pSheet.find = function(id: string) { return sheet.get(id)}
    _pSheet.stringId = function() { return intToWord(sheet.getSheetId())}
    _pSheet.entryStates = {}
    _pSheet.selectedComp = signal(undefined)
    return _pSheet
}