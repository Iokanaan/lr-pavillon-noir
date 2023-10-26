import { mapEscrime } from "../utils/mappers";
import { computed, effect, signal } from "../utils/utils";

export const setupCompEscrimeDisplayEntry = function(entry: Component<EscrimeData>) {
    const compEscrime = signal(entry.find("comp_escrime_val").value())
    const ptsEscrime = computed(function() {
        const bonus = entry.value().predilection ? 1 : 0
        let total = 0
        for(let i=1;i<=4;i++) {
            total += i + bonus;
        }
        return total
    }, [compEscrime])
    effect(function() {
        entry.find("pts_escrime_val").value(ptsEscrime())
    }, [ptsEscrime])
}

export const setupCompEscrimeEditEntry = function(entry: Component) {
    
    const escrimeChoiceCmp = entry.find("comp_escrime_choice");
    const escrimeInputCmp = entry.find("comp_escrime_input");
    const oppCmps: Component<number | null>[] = [
        entry.find("opp_1"),
        entry.find("opp_2"),
        entry.find("opp_3"),
        entry.find("opp_4"),
        entry.find("opp_5")
    ]
    const manoeuvresInputComp = entry.find("manoeuvres_input")

    // Signal local pour la sélection de la competence 
    const selectedEscrime = signal(mapEscrime(Tables.get("escrimes").get(escrimeChoiceCmp.value()))) as Signal<Escrime>

    // Mise à jour du métier, on met à jour la profession sélectionnée
    escrimeChoiceCmp.on("update", function(cmp) {
        selectedEscrime.set(mapEscrime(Tables.get("comp_escrime_choice").get(cmp.value())))
    })

    effect(function() {
        const escrime = selectedEscrime()
        escrimeInputCmp.value(escrime.name)
        let i = 0
        const manoeuvres: string[] = []
        while(i < escrime.opportunites.length) {
            const opp = escrime.opportunites[i]
            oppCmps[i].value(opp)
            manoeuvres.push("(" + opp.toString() + ") " + Tables.get("manoeuvres").get(opp.toString()).name)
            i++
        }
        while(i < oppCmps.length) {
            oppCmps[i].value(null)
            i++
        }
        manoeuvresInputComp.value(manoeuvres.join(', '))

    }, [selectedEscrime])

    entry.find("display_custom").on("click", function() {
        if(entry.find("predef_col").visible()) {
            entry.find("predef_col").hide()
            entry.find("custom_col").show()
        } else {
            entry.find("predef_col").show()
            entry.find("custom_col").hide()
        }
    })
}