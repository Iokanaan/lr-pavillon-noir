export const registreNavire = function(sheet: NavireSheet, label: string) {
    sheet.find(label + "_title").on("click", function(cmp) {
        if(sheet.find(label + "_label").visible()) {
            sheet.find(label + "_label").hide()
            sheet.find(label + "_input").show()
        } else {
            sheet.find(label + "_label").show()
            sheet.find(label + "_input").hide()
        }
    })

    sheet.find(label + "_input").on("update", function(cmp) {
        cmp.hide()
        sheet.find(label + "_label").show()
        if(cmp.value() !== "") {
            sheet.find(label + "_label").value(cmp.value())
        } else {
            sheet.find(label + "_label").value(" ")
        }
    })
}