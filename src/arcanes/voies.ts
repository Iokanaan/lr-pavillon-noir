import { setupRepeater } from "../utils/repeaters"
import { effect } from "../utils/utils"

export const pouvoirsSacres = function(sheet: PavillonSheet, num: number) {
    (sheet.find("foi_" + num) as Component<number>).on("update", function(cmp) {
        sheet.voies[num - 1].foi.set(cmp.value())
    })
    
    effect(function() {
        if(sheet.typeArcane() !== null && sheet.typeArcane() !== undefined) {
            sheet.find("foi_titre_" + num).value(_(Tables.get("rangs_foi").get(sheet.voies[num - 1].rangFoi().toString())[sheet.typeArcane()]))
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

    setupRepeater(sheet, "arcanes_pouvoirs_" + num, null, setupPouvoirDisplayEntry, null)

    sheet.find("voie_" + num).on("click", function(cmp) {
        sheet.find("voie_" + num + "_input").show()
        cmp.hide()
    })

    sheet.find("voie_" + num + "_input").on("update", function(cmp) {
        sheet.find("voie_" + num).show()
        cmp.hide()
        sheet.find("voie_" + num).value(cmp.value())
    })

}

const setupPouvoirDisplayEntry = function(entry: Component) {
    entry.find("compulsions_row").hide()
    entry.find("visions_row").hide()
    entry.find("display_detail").on("click", function() {
        if(entry.find("compulsions_row").visible()) {
            entry.find("compulsions_row").hide()
            entry.find("visions_row").hide()
        } else {
            entry.find("compulsions_row").show()
            entry.find("visions_row").show()
        }
    })
}

