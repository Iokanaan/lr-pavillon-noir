import { computed, effect, signal } from "../utils/utils";

export const reputationListener = function(sheet: PavillonSheet, typeRep: "glo" | "inf") {

    // Mise à jour de la feuille avec le score de réputation
    (sheet.find(typeRep + "_points") as Component<number>).on("update", function(cmp) {
        sheet.reputation[typeRep].score.set(cmp.value())
    });

    // Affichage du niveau du nombre requis
    effect(function() {
        sheet.find(typeRep + "_lvl").value(sheet.reputation[typeRep].level())
        sheet.find(typeRep + "_label").value(_(Tables.get(typeRep).get(sheet.reputation[typeRep].level().toString()).name))
        for(let i=1;i<=10; i++) {
            if(sheet.reputation[typeRep].level() >= i) {
                sheet.find(typeRep + "_" + i).show()
            } else {
                sheet.find(typeRep + "_" + i).hide()
            }
        }
    }, [sheet.reputation[typeRep].level])
}