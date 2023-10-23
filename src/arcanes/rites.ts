export const ritesDisplayEntry = function(entry: Component<RiteData>) {
    entry.find("rite_desc_col").hide()
    entry.find("display_rite_col").on("click", function() {
        if(entry.find("rite_desc_col").visible()) {
            entry.find("rite_desc_col").hide()
        } else {
            entry.find("rite_desc_col").show()
        }
    })
}