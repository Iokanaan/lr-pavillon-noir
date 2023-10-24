import { effect } from "../utils/utils"

export const pouvoirsSacres = function(sheet: PavillonSheet, num: number) {
    (sheet.find("foi_" + num) as Component<number>).on("update", function(cmp) {
        sheet.voies[num - 1].foi.set(cmp.value())
    })
    effect(function() {
        if(sheet.typeArcane() !== null && sheet.typeArcane() !== undefined) {
            sheet.find("foi_titre_" + num).value(Tables.get("rangs_foi").get(sheet.voies[num - 1].rangFoi()[sheet.typeArcane()]))
        }
    }, [sheet.voies[num - 1].rangFoi, sheet.typeArcane])
    effect(function() {
        for(let i=1;i<=6;i++) {
            if(i>sheet.voies[num - 1].rangFoi()) {
                sheet.find("pouvoir_sacre_" + num + "_" + i).hide()
            } else {
                sheet.find("pouvoir_sacre_" + num + "_" + i).show()
            }
        }
    }, [sheet.voies[num - 1].rangFoi])
}