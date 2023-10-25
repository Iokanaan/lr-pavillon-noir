export const ritesDisplayEntry = function(entry: Component<RiteData>) {
    entry.find("rite_desc_col").hide()
    entry.find("nom_display").on("click", function() {
        if(entry.find("rite_desc_col").visible()) {
            entry.find("rite_desc_col").hide()
        } else {
            entry.find("rite_desc_col").show()
        }
    })
}