import { computed, signal } from "../utils/utils";

export const reputationListener = function(sheet: PavillonSheet, typeRep: "glo" | "inf") {
    const reputationScore = signal((sheet.find(typeRep + "_points") as Component<number>).value());
    
    (sheet.find(typeRep + "_points") as Component<number>).on("update", function(cmp) {
        reputationScore.set(cmp.value())
    })

    const levels = Tables.get(typeRep)
    sheet.reputation[typeRep] = computed(function() {
        const rep = reputationScore() 
        if(rep < 50) {
            return 0
        }
        if(rep < 100) {
            return 1
        }
        if(rep < 150) {
            return 2
        }
        if(rep < 200) {
            return 3
        }
        if(rep < 300) {
            return 4
        }
        if(rep < 500) {
            return 5
        }
        if(rep < 1000) {
            return 6
        }
        if(rep < 2000) {
            return 7
        }
        if(rep < 5000) {
            return 8
        }
        if(rep < 10000) {
            return 9
        }
        return 10
    }, [reputationScore])

    computed(function() {
        sheet.find(typeRep + "_label").value(_(Tables.get(typeRep).get(sheet.reputation[typeRep]().toString()).name))
    }, [sheet.reputation[typeRep]])

    computed(function() {
        const reputation = sheet.reputation[typeRep]()
        for(let i=1;i<=10; i++) {
            if(reputation >= i) {
                sheet.find(typeRep + "_" + i).show()
            } else {
                sheet.find(typeRep + "_" + i).hide()
            }
        }
    }, [sheet.reputation[typeRep]])
}