import { postes } from "../globals"

export const setupSignalUpdates = function(sheet: NavireSheet) {
    each(postes, function(comps, poste) {
        for(let i=0; i<comps.length; i++) {
            sheet.find("metier_" + poste + "_val").on("update", function(cmp)  {
                sheet.feuilleEquipage.commandement[poste as PosteBord].metier.set(cmp.value() as number)
            })
            setupCompUpdate(sheet, poste as PosteBord, comps[i])
        }
    })
}

const setupCompUpdate = function(sheet: NavireSheet, poste: PosteBord, comp: string) {
    sheet.find(poste + "_" + comp + "_val").on("update", function(cmp) {
        sheet.feuilleEquipage.commandement[poste][comp].set(cmp.value() as number)
    })
}