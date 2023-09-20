import { computed, signal } from "../utils/utils"

export const setupDisplayedBlessures = function(sheet: PavillonSheet) {
    computed(function() {
        const localisations = ["tete","torse","bd","bg","jd","jg"]
        const res = sheet.attr['RES']()
        for(let loc=0;loc<localisations.length;loc++) {
            for(let i=1;i<=11;i++) {
                if(i<=res+2) {
                    sheet.find("blessure_" + localisations[loc] + "_"  + i).show()
                } else {
                    sheet.find("blessure_" + localisations[loc] + "_"  + i).hide()
                }
            }
            if(res <= 4) {
                sheet.find("blessures_" + localisations[loc] + "_legeres").hide()
            } else {
                sheet.find("blessures_" + localisations[loc] + "_legeres").show()
            }
            if(res <=3) {
                sheet.find("blessures_" + localisations[loc] + "_serieuses").hide()
            } else {
                sheet.find("blessures_" + localisations[loc] + "_serieuses").show()
            }
            if(res <=2) {
                sheet.find("blessures_" + localisations[loc] + "_graves").hide()
            } else {
                sheet.find("blessures_" + localisations[loc] + "_graves").show()
            }
        }
    }, [sheet.attr['RES']])

    const blessureSignals: Record<"tete"|"torse"|"bg"|"bd"|"jd"|"jg", Record<"legere" | "serieuse" | "grave" | "critique" | "coma" | "mort", Signal<boolean>[]>> = {
        "tete": {
            legere: [signal(sheet.find("blessure_tete_7").value()as boolean), signal(sheet.find("blessure_tete_8").value()as boolean)],
            serieuse: [signal(sheet.find("blessure_tete_6").value()as boolean), signal(sheet.find("blessure_tete_9").value()as boolean)],
            grave: [signal(sheet.find("blessure_tete_5").value()as boolean), signal(sheet.find("blessure_tete_10").value()as boolean)],
            critique: [signal(sheet.find("blessure_tete_4").value()as boolean), signal(sheet.find("blessure_tete_11").value()as boolean)],
            coma: [signal(sheet.find("blessure_tete_3").value()as boolean), signal(sheet.find("blessure_tete_2").value()as boolean)],
            mort: [signal(sheet.find("blessure_tete_1").value()as boolean)]
        },
        "torse": {
            legere: [signal(sheet.find("blessure_torse_7").value()as boolean), signal(sheet.find("blessure_torse_8").value()as boolean)],
            serieuse: [signal(sheet.find("blessure_torse_6").value()as boolean), signal(sheet.find("blessure_torse_9").value()as boolean)],
            grave: [signal(sheet.find("blessure_torse_5").value()as boolean), signal(sheet.find("blessure_torse_10").value()as boolean)],
            critique: [signal(sheet.find("blessure_torse_4").value()as boolean), signal(sheet.find("blessure_torse_11").value()as boolean)],
            coma: [signal(sheet.find("blessure_torse_3").value()as boolean), signal(sheet.find("blessure_torse_2").value()as boolean)],
            mort: [signal(sheet.find("blessure_torse_1").value()as boolean)]
        },
        "bd": {
            legere: [signal(sheet.find("blessure_bd_7").value()as boolean), signal(sheet.find("blessure_bd_8").value()as boolean)],
            serieuse: [signal(sheet.find("blessure_bd_6").value()as boolean), signal(sheet.find("blessure_bd_9").value()as boolean)],
            grave: [signal(sheet.find("blessure_bd_5").value()as boolean), signal(sheet.find("blessure_bd_10").value()as boolean)],
            critique: [signal(sheet.find("blessure_bd_4").value()as boolean), signal(sheet.find("blessure_bd_11").value()as boolean)],
            coma: [signal(sheet.find("blessure_bd_3").value()as boolean), signal(sheet.find("blessure_bd_2").value()as boolean)],
            mort: [signal(sheet.find("blessure_bd_1").value()as boolean)]
        },
        "bg": {
            legere: [signal(sheet.find("blessure_bg_7").value()as boolean), signal(sheet.find("blessure_bg_8").value()as boolean)],
            serieuse: [signal(sheet.find("blessure_bg_6").value()as boolean), signal(sheet.find("blessure_bg_9").value()as boolean)],
            grave: [signal(sheet.find("blessure_bg_5").value()as boolean), signal(sheet.find("blessure_bg_10").value() as boolean)],
            critique: [signal(sheet.find("blessure_bg_4").value()as boolean), signal(sheet.find("blessure_bg_11").value()as boolean)],
            coma: [signal(sheet.find("blessure_bg_3").value()as boolean), signal(sheet.find("blessure_bg_2").value()as boolean)],
            mort: [signal(sheet.find("blessure_bg_1").value()as boolean)]
        },
        "jd": {
            legere: [signal(sheet.find("blessure_jd_7").value()as boolean), signal(sheet.find("blessure_jd_8").value()as boolean)],
            serieuse: [signal(sheet.find("blessure_jd_6").value()as boolean), signal(sheet.find("blessure_jd_9").value()as boolean)],
            grave: [signal(sheet.find("blessure_jd_5").value()as boolean), signal(sheet.find("blessure_jd_10").value()as boolean)],
            critique: [signal(sheet.find("blessure_jd_4").value()as boolean), signal(sheet.find("blessure_jd_11").value()as boolean)],
            coma: [signal(sheet.find("blessure_jd_3").value()as boolean), signal(sheet.find("blessure_jd_2").value()as boolean)],
            mort: [signal(sheet.find("blessure_jd_1").value()as boolean)]
        },
        "jg": {
            legere: [signal(sheet.find("blessure_jg_7").value() as boolean), signal(sheet.find("blessure_jg_8").value()as boolean)],
            serieuse: [signal(sheet.find("blessure_jg_6").value() as boolean), signal(sheet.find("blessure_jg_9").value()as boolean)],
            grave: [signal(sheet.find("blessure_jg_5").value() as boolean), signal(sheet.find("blessure_jg_10").value()as boolean)],
            critique: [signal(sheet.find("blessure_jg_4").value() as boolean), signal(sheet.find("blessure_jg_11").value()as boolean)],
            coma: [signal(sheet.find("blessure_jg_3").value() as boolean), signal(sheet.find("blessure_jg_2").value()as boolean)],
            mort: [signal(sheet.find("blessure_jg_1").value() as boolean)]
        },
    }

    sheet.find("blessure_tete_1").on("update", function(cmp) { blessureSignals["tete"]["mort"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_tete_2").on("update", function(cmp) { blessureSignals["tete"]["coma"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_tete_3").on("update", function(cmp) { blessureSignals["tete"]["coma"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_tete_4").on("update", function(cmp) { blessureSignals["tete"]["critique"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_tete_11").on("update", function(cmp) { blessureSignals["tete"]["critique"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_tete_5").on("update", function(cmp) { blessureSignals["tete"]["grave"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_tete_10").on("update", function(cmp) { blessureSignals["tete"]["grave"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_tete_6").on("update", function(cmp) { blessureSignals["tete"]["serieuse"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_tete_9").on("update", function(cmp) { blessureSignals["tete"]["serieuse"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_tete_7").on("update", function(cmp) { blessureSignals["tete"]["legere"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_tete_8").on("update", function(cmp) { blessureSignals["tete"]["legere"][1].set(cmp.value() as boolean) })

    sheet.find("blessure_torse_1").on("update", function(cmp) { blessureSignals["torse"]["mort"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_torse_2").on("update", function(cmp) { blessureSignals["torse"]["coma"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_torse_3").on("update", function(cmp) { blessureSignals["torse"]["coma"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_torse_4").on("update", function(cmp) { blessureSignals["torse"]["critique"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_torse_11").on("update", function(cmp) { blessureSignals["torse"]["critique"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_torse_5").on("update", function(cmp) { blessureSignals["torse"]["grave"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_torse_10").on("update", function(cmp) { blessureSignals["torse"]["grave"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_torse_6").on("update", function(cmp) { blessureSignals["torse"]["serieuse"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_torse_9").on("update", function(cmp) { blessureSignals["torse"]["serieuse"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_torse_7").on("update", function(cmp) { blessureSignals["torse"]["legere"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_torse_8").on("update", function(cmp) { blessureSignals["torse"]["legere"][1].set(cmp.value() as boolean) })

    sheet.find("blessure_bd_1").on("update", function(cmp) { blessureSignals["bd"]["mort"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bd_2").on("update", function(cmp) { blessureSignals["bd"]["coma"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bd_3").on("update", function(cmp) { blessureSignals["bd"]["coma"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_bd_4").on("update", function(cmp) { blessureSignals["bd"]["critique"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bd_11").on("update", function(cmp) { blessureSignals["bd"]["critique"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_bd_5").on("update", function(cmp) { blessureSignals["bd"]["grave"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bd_10").on("update", function(cmp) { blessureSignals["bd"]["grave"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_bd_6").on("update", function(cmp) { blessureSignals["bd"]["serieuse"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bd_9").on("update", function(cmp) { blessureSignals["bd"]["serieuse"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_bd_7").on("update", function(cmp) { blessureSignals["bd"]["legere"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bd_8").on("update", function(cmp) { blessureSignals["bd"]["legere"][1].set(cmp.value() as boolean) })

    sheet.find("blessure_bg_1").on("update", function(cmp) { blessureSignals["bg"]["mort"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bg_2").on("update", function(cmp) { blessureSignals["bg"]["coma"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bg_3").on("update", function(cmp) { blessureSignals["bg"]["coma"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_bg_4").on("update", function(cmp) { blessureSignals["bg"]["critique"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bg_11").on("update", function(cmp) { blessureSignals["bg"]["critique"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_bg_5").on("update", function(cmp) { blessureSignals["bg"]["grave"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bg_10").on("update", function(cmp) { blessureSignals["bg"]["grave"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_bg_6").on("update", function(cmp) { blessureSignals["bg"]["serieuse"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bg_9").on("update", function(cmp) { blessureSignals["bg"]["serieuse"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_bg_7").on("update", function(cmp) { blessureSignals["bg"]["legere"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_bg_8").on("update", function(cmp) { blessureSignals["bg"]["legere"][1].set(cmp.value() as boolean) })

    sheet.find("blessure_jd_1").on("update", function(cmp) { blessureSignals["jd"]["mort"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jd_2").on("update", function(cmp) { blessureSignals["jd"]["coma"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jd_3").on("update", function(cmp) { blessureSignals["jd"]["coma"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_jd_4").on("update", function(cmp) { blessureSignals["jd"]["critique"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jd_11").on("update", function(cmp) { blessureSignals["jd"]["critique"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_jd_5").on("update", function(cmp) { blessureSignals["jd"]["grave"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jd_10").on("update", function(cmp) { blessureSignals["jd"]["grave"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_jd_6").on("update", function(cmp) { blessureSignals["jd"]["serieuse"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jd_9").on("update", function(cmp) { blessureSignals["jd"]["serieuse"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_jd_7").on("update", function(cmp) { blessureSignals["jd"]["legere"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jd_8").on("update", function(cmp) { blessureSignals["jd"]["legere"][1].set(cmp.value() as boolean) })

    sheet.find("blessure_jg_1").on("update", function(cmp) { blessureSignals["jg"]["mort"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jg_2").on("update", function(cmp) { blessureSignals["jg"]["coma"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jg_3").on("update", function(cmp) { blessureSignals["jg"]["coma"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_jg_4").on("update", function(cmp) { blessureSignals["jg"]["critique"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jg_11").on("update", function(cmp) { blessureSignals["jg"]["critique"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_jg_5").on("update", function(cmp) { blessureSignals["jg"]["grave"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jg_10").on("update", function(cmp) { blessureSignals["jg"]["grave"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_jg_6").on("update", function(cmp) { blessureSignals["jg"]["serieuse"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jg_9").on("update", function(cmp) { blessureSignals["jg"]["serieuse"][1].set(cmp.value() as boolean) })
    sheet.find("blessure_jg_7").on("update", function(cmp) { blessureSignals["jg"]["legere"][0].set(cmp.value() as boolean) })
    sheet.find("blessure_jg_8").on("update", function(cmp) { blessureSignals["jg"]["legere"][1].set(cmp.value() as boolean) })

    const maxBlessuresRecord: Record<string, Computed<"legere" | "serieuse" | "grave" | "critique" | "coma" | "mort" | "aucune">> = {}
    each(blessureSignals, function(typeBlessure, loc) {
        const niveauxBlessures: Record<string, Computed<boolean>> = {}
        each(typeBlessure, function(hasBlessure: Signal<boolean>[], typeBessureKey) {
            niveauxBlessures[typeBessureKey] = computed(function() {
                let blesse = false
                for(let i=0;i<hasBlessure.length;i++) {
                    blesse = blesse || hasBlessure[0]()
                }
                return blesse
            }, hasBlessure)
        })
        maxBlessuresRecord[loc] = computed(function() {
            if(niveauxBlessures['mort']()) {
                return "mort"
            }
            if(niveauxBlessures['coma']()) {
                return "coma"
            }
            if(niveauxBlessures['critique']()) {
                return "critique"
            }
            if(niveauxBlessures['grave']()) {
                return 'grave'
            }
            if(niveauxBlessures['serieuse']()) {
                return 'serieuse'
            }
            if(niveauxBlessures['legere']()) {
                return 'legere'
            }
            return 'aucune'
        }, [
            niveauxBlessures['legere'],
            niveauxBlessures['serieuse'],
            niveauxBlessures['grave'],
            niveauxBlessures['critique'],
            niveauxBlessures['coma'],
            niveauxBlessures['mort']
        ])
    })
    const niveauGeneralBlessure = computed(function() {
        const blessuresByLoc = {
            "tete": maxBlessuresRecord['tete'](),
            "torse": maxBlessuresRecord['torse'](),
            "bd": maxBlessuresRecord['bd'](),
            "bg": maxBlessuresRecord['bg'](),
            "jg": maxBlessuresRecord['jg'](),
            "jd": maxBlessuresRecord['jd'](),
        }
        const blessuresByLevel = {
            aucune:0,
            legere:0,
            serieuse:0,
            grave:0,
            critique:0,
            coma:0,
            mort:0
        }
        each(blessuresByLoc, function(blessure, localisation) {
            blessuresByLevel[blessure]++
        })
        if(blessuresByLevel.mort>0 || blessuresByLevel.coma > 1) {
            return "mort"
        }
        if(blessuresByLevel.coma>0 || blessuresByLevel.critique>1) {
            return "coma"
        }
        if(blessuresByLevel.critique>0 || blessuresByLevel.grave>1) {
            return "critique"
        }
        if(blessuresByLevel.grave >0 || blessuresByLevel.serieuse>1) {
            return "grave"
        }
        if(blessuresByLevel.serieuse>0 || blessuresByLevel.legere>1) {
            return "serieuse"
        }
        if(blessuresByLevel.legere>0) {
            return "legere"
        }
        return "aucune"
    },[
        maxBlessuresRecord['tete'],
        maxBlessuresRecord['torse'],
        maxBlessuresRecord['bd'],
        maxBlessuresRecord['bg'],
        maxBlessuresRecord['jg'],
        maxBlessuresRecord['jd']
    ])

    computed(function() {
        switch(niveauGeneralBlessure()) {
            case "mort":
                sheet.find("etat_general_label").value("Mort")
                break
            case "coma":
                sheet.find("etat_general_label").value("Coma")
                break
            case "critique":
                sheet.find("etat_general_label").value("Critique")
                break
            case "grave":
                sheet.find("etat_general_label").value("Grave")
                break
            case "serieuse":
                sheet.find("etat_general_label").value("Sérieux")
                break
            case "legere":
                sheet.find("etat_general_label").value("Léger")
                break
            case "aucune":
            default:
                sheet.find("etat_general_label").value("Intact")
        }
    }, [niveauGeneralBlessure])
    
}