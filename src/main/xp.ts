import { effect, signal } from "../utils/utils"

export const setupXp = function(sheet: PavillonSheet) {
    const xpPlus = sheet.find("xp_plus") as Component<string>
    const xpMin = sheet.find("xp_minus") as Component<string>
    const xpNbRows = sheet.find("xp_nb_rows") as Component<number>
    const xpRows: Component<null>[] = []
    for(let i=1; i<=4; i++) {
        xpRows.push(sheet.find("xp_row_" + i) as Component<null>)
    }

    const xpNbRowsSignal = signal(xpNbRows.value())

    xpPlus.on("click", function() {
        xpNbRows.value(xpNbRows.value() + 1)
    })

    xpMin.on("click", function() {
        xpNbRows.value(xpNbRows.value() - 1)
    })

    xpNbRows.on("update", function(cmp) {
        xpNbRowsSignal.set(cmp.value())
    })

    effect(function() {
        let i=0
        while(i<xpNbRowsSignal()) {
            xpRows[i].show()
            i++
        }
        while(i<4) {
            xpRows[i].hide()
            i++
        }
        if(xpNbRowsSignal() >= 4) {
            xpPlus.hide()
        } else {
            xpPlus.show()
        }
        if(xpNbRowsSignal() <= 1) {
            xpMin.hide()
        } else {
            xpMin.show()
        }
    }, [xpNbRowsSignal])
}