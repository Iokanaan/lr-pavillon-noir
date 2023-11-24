import { globalNavireSheets } from "../globals"
import { effect, signal } from "../utils/utils"

export const setupArtillerieEditEntry = function(entry: Component<ArtillerieData>) {
    const sheet = globalNavireSheets[entry.sheet().getSheetId()]
    
    log("emplacement")
    const empCmp = entry.find("emplacement") as ChoiceComponent<string>
    log("signal")
    const emp = signal(empCmp.value())
    log("effect")
    effect(function() {
        log("setupe")
        if(emp() === "muraille" || emp() === "bordee") {
            sheet.find("double").show()
        } else {
            sheet.find("double").hide()
        }
        if(emp() === "muraille") {
            sheet.find("muraille_col").show()
        } else {
            sheet.find("muraille_col").hide()
        }
    }, [emp])
    log("done")

    empCmp.on("update", function(cmp) {
        emp.set(cmp.value())
    })
}

export const setupArtillerieDisplayEntry = function(entry: Component<ArtillerieData>) {
    const sheet = globalNavireSheets[entry.sheet().getSheetId()]
    const allArmemement = sheet.armement.armementByEntry()
    allArmemement[entry.id()] = entry.value()
    sheet.armement.armementByEntry.set(allArmemement)
}