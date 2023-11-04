import { effect } from "../utils/utils"

export const testNavire = function(sheet: NavireSheet) {
    log("init")
    sheet.find("rolldice").on("click", function() {
        new RollBuilder(sheet.raw()).expression("1d10").roll()
    })
    sheet.find("test_input").on("update", function(cmp) {
        sheet.test.set(cmp.value() as number)
    })
    effect(function() {
        sheet.find('test_val').value(sheet.test())
    }, [sheet.test])

}