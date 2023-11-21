export const registreNavire = function(sheet: NavireSheet, label: string) {
    sheet.find(label + "_label").on("click", function(cmp) {
        cmp.hide()
        sheet.find(label + "_cancel").show()
        sheet.find(label + "_input").show()
    })

    sheet.find(label + "_cancel").on("click", function(cmp) {
        cmp.hide()
        sheet.find(label + "_label").show()
        sheet.find(label + "_input").hide()
    })

    sheet.find(label + "_input").on("update", function(cmp) {
        cmp.hide()
        sheet.find(label + "_label").show()
        sheet.find(label + "_cancel").hide()
        if(cmp.value() !== "") {
            sheet.find(label + "_label").value(cmp.value())
        } else {
            sheet.find(label + "_label").value(" ")
        }
    })
}