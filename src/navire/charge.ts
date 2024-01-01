import { globalNavireSheets } from "../globals"
import { effect } from "../utils/utils"

export const setupChargeDisplayEntry = function(entry: Component<ChargeData>) {
    const sheet = globalNavireSheets[entry.sheet().getSheetId()]
    const allCharge = sheet.chargeByEntry()
    allCharge[entry.id()] = entry.value().tonnage
    sheet.chargeByEntry.set(allCharge)
}

export const setupTotalTonnage = function(sheet: NavireSheet) {
    effect(function() {
        sheet.find("charge_tonnage_total").value("Total : " + sheet.charge() + " / T")
    }, [sheet.charge])
}