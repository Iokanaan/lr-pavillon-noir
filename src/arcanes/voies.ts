export const pouvoirsSacres = function(sheet: PavillonSheet) {
    (sheet.find("foi_1") as Component<number>).on("update", function(cmp) {
        sheet.voies[0].foi.set(cmp.value())
    })
    effect(function() {
        if(sheet.typeArcane() !== null && sheet.typeArcane() !== undefined) {
            sheet.find("foi_titre_1").value(Tables.get("rangs_foi").get(sheet.voies[0].rangFoi()[sheet.typeArcane()]))
        }
    }, [sheet.voies[0].rangFoi, sheet.typeArcane])
    effect(function() {
        for(let i=1;i<=6;i++) {
            if(i>sheet.voies[0].rangFoi()) {
                sheet.find("pouvoir_sacre_1_" + i).hide()
            } else {
                sheet.find("pouvoir_sacre_1_" + i).show()
            }
        }
    }, [sheet.voies[0].rangFoi])
}