import { globalNavireSheets } from "../globals"
import { mapTypeCanon } from "../utils/mappers"
import { effect, signal } from "../utils/utils"

export const setupArtillerieEditEntry = function(entry: Component<ArtillerieData>) {
    const sheet = globalNavireSheets[entry.sheet().getSheetId()]
    
    const empCmp = entry.find("emplacement") as ChoiceComponent<string>
    const emp = signal(empCmp.value())
    if(entry.value().calibre === undefined) {
        entry.find("calibre").value("0")
    }
    if(entry.value().nb_canons === undefined) {
        entry.find("nb_canons").value(1)
    }
    if(entry.value().nb_hommes === undefined) {
        entry.find("nb_hommes").value(0)
    }
    if(entry.value().pertes === undefined) {
        entry.find("pertes").value("0")
    }
    if(entry.value().tonnage === undefined) {
        entry.find("tonnage").value("0")
    }
    if(entry.value().eff_canonnade === undefined) {
        entry.find("eff_canonnade").value(0)
    }
    if(entry.value().fac_canonnade === undefined) {
        entry.find("fac_canonnade").value(0)
    }
    if(entry.value().modif_recharge === undefined) {
        entry.find("modif_recharge").value(0)
    }
    entry.find("preset").on("update", function(cmp) {
        if(cmp.value() !== undefined) {
            const canon = mapTypeCanon(Tables.get("types_canons").get(cmp.value()))
            entry.find("nom").value(canon.label)
            entry.find("calibre").value(canon.calibre)
            entry.find("nb_hommes").value(canon.nb_hommes)
            entry.find("pertes").value(canon.pertes)
            entry.find("tonnage").value(canon.tonnage)
            entry.find("eff_canonnade").value(canon.eff_canonnade)
            entry.find("fac_canonnade").value(canon.fac_canonnade)
            entry.find("modif_recharge").value(canon.recharge)
        }

    })
    effect(function() {
        if(emp() === "muraille" || emp() === "bordee") {
            sheet.find("double").show()
        } else {
            sheet.find("double").hide()
        }
        if(emp() === "muraille") {
            sheet.find("muraille_col").show()
        } else {
            sheet.find("muraille_col").hide()
        }
    }, [emp])

    empCmp.on("update", function(cmp) {
        emp.set(cmp.value())
    })
}

export const setupArtillerieDisplayEntry = function(entry: Component<ArtillerieData>) {
    let tonnageTotal = +(entry.value().nb_canons) * +(entry.value().tonnage)
    if(entry.value().emplacement === "bordee") {
        tonnageTotal = tonnageTotal * 2
    }
    log(Tables.get("places_artillerie").get(entry.value().emplacement).name)
    entry.find("emplacement_label").text(Tables.get("places_artillerie").get(entry.value().emplacement).name)
    entry.find("tonnage_calcule").text(tonnageTotal.toString())
    const sheet = globalNavireSheets[entry.sheet().getSheetId()]
    const allArmemement = sheet.armement.armementByEntry()
    allArmemement[entry.id()] = entry.value()
    sheet.armement.armementByEntry.set(allArmemement)
}


export const onArtillerieDelete = function(sheet: NavireSheet) {
    return function(entryId: string) {
        const armement = sheet.armement.armementByEntry()
        delete armement[entryId]
        sheet.armement.armementByEntry.set(armement)
    }
}

export const setupTonnageArtillerie = function(sheet: NavireSheet) {
    effect(function() {
        sheet.find("tonnage_armement").value("Total : " + sheet.armement.tonnage() + " / T")
    }, [sheet.armement.tonnage])
}

export const setupDegats = function(sheet: NavireSheet) {
    effect(function() {
        const emplacement = sheet.armement.armementByEmplacement()
        const data: Record<string, string | number> = {} 
        each(emplacement, function(val, id) {
            if(val.nbCanons === 0) {
                sheet.find(id + "_degats_row").hide()
            } else {
                if(val.degats < 1) {
                    data[id + "_degats_mes"] = Math.ceil(val.degats * 100) / 100    
                } else {
                    data[id + "_degats_mes"] = Math.ceil(val.degats)
                }
                data[id + "_degats_val"] = val.degatsValeur
                if(val.pertes < 1) {
                    data[id + "_pertes_mes"] = Math.ceil(val.pertes * 100) / 100    
                } else {
                    data[id + "_pertes_mes"] = Math.ceil(val.pertes)
                }
                data[id + "_pertes_val"] = val.pertesValeur
                data[id + "_portee_val"] = val.portee
                data[id + "_hommes_val"] = val.nbHommes
                sheet.find(id + "_degats_row").show()
            }
            switch(id) {
                case "bordee":
                    if(val.nbCanons > 0) {
                        sheet.find("recharge_bordee_babord").show()
                        sheet.find("recharge_bordee_tribord").show()
                    } else {
                        sheet.find("recharge_bordee_babord").hide()
                        sheet.find("recharge_bordee_tribord").hide()
                    }
                    break;
                case "chasse":
                    if(val.nbCanons > 0) {
                        sheet.find("recharge_chasse").show()
                    } else {
                        sheet.find("recharge_chasse").hide()
                    }
                    break;
                case "fuite":
                    if(val.nbCanons > 0) {
                        sheet.find("recharge_fuite").show()
                    } else {
                        sheet.find("recharge_fuite").hide()
                    }
                    break;
                case "muraille":
                    if(val.nbCanons > 0) {
                        sheet.find("recharge_muraille_babord").show()
                        sheet.find("recharge_muraille_tribord").show()
                    } else {
                        sheet.find("recharge_muraille_babord").hide()
                        sheet.find("recharge_muraille_tribord").hide()
                    }
                    break;
                default:
            }
        })
        sheet.raw().setData(data)
    }, [sheet.armement.armementByEmplacement]);

    const zonesArtillerie: ZoneTirArtillerie[] = ["bordee", "chasse", "fuite", "muraille", "muraille_chasse", "muraille_fuite"]
    zonesArtillerie.forEach(function(val) {
        sheet.find(val + "_charge").on("update", function(cmp) {
            const typesBoulets = sheet.armement.typeBouletByEmplacement()
            typesBoulets[val] = cmp.value() as string
            sheet.armement.typeBouletByEmplacement.set(typesBoulets)
        })
    })

    
}