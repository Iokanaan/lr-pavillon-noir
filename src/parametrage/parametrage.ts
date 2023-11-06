export const setParametrage = function(sheet: PavillonSheet) {
    sheet.find("exclude_long_feu").on("update", function(cmp) {
        sheet.params.excludeLongFeu.set(cmp.value())   
    })
}