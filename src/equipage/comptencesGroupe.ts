import { competencesGroupe } from "../globals"
import { effect, intToWord, setVirtualColorFromSignal } from "../utils/utils"

const handleDisplayBloc = function(sheet: NavireSheet, bloc: string) {
    return function() {
        each(competencesGroupe, function(_, key) {
            if(key === bloc) {
                sheet.find(key + "_detail_row").show()
            } else {
                sheet.find(key + "_detail_row").hide()
            }
        })
    }
}

const setupRoll = function(sheet: NavireSheet, title: string, eff: Component, fac: Component, baseEffSignal: Signal<number> | Computed<number>, baseFacSignal: Signal<number> | Computed<number>, flagCompGroupe: boolean, flagLoc: boolean, flagRecharge: boolean, flagManoeuvre: boolean) {
    return function() {
        let dice = "10"
        let nDice = parseInt(eff.value())
        let totalFac = parseInt(fac.value())
        if(flagCompGroupe) {
            nDice -= Math.abs(sheet.feuilleEquipage.malusSante())
        }
        if(flagRecharge) {
            nDice -= Math.abs(sheet.equipage.malusRecharge())
        }
        if(nDice<=0) {
            dice = "12"
        }
        if(flagManoeuvre) {
            totalFac = +(totalFac) + +(sheet.structure.modifVoilureManoeuvre()) + +(sheet.structure.malusMature())
        }
        let expression = "(" + Math.max(nDice, 1) + "d" + dice + " <={1:2} " + totalFac + ")[eff_" + intToWord(Math.max(nDice, 0)) + ",fac_" + intToWord(totalFac) + "]"
        if(flagLoc) {
            let tagLoc = "localisation_navire"
            expression += " + 1d6[" + tagLoc + "]"
        }
        new RollBuilder(sheet.raw()).expression(expression).title(title).roll()
        eff.value(baseEffSignal())
        fac.value(baseFacSignal())
        setVirtualColorFromSignal(eff, baseEffSignal)
        setVirtualColorFromSignal(fac, baseFacSignal)
    }
}


const valEffect = function(sheet: NavireSheet, categorie: string, role: PosteBord, comp: string) {
    effect(function() {
        sheet.find(categorie + "_" + role + "_" + comp + "_val").value(sheet.feuilleEquipage.commandement[role][comp]())
    }, [sheet.feuilleEquipage.commandement[role][comp]])       
}

const effEffect = function(sheet: NavireSheet, categorie: string) {
    effect(function() {
        sheet.find(categorie + "_total_eff").value(sheet.feuilleEquipage.competencesGroupe[categorie].efficacite())
        sheet.find(categorie + "_eff").value(sheet.feuilleEquipage.competencesGroupe[categorie].efficacite())
    }, [sheet.feuilleEquipage.competencesGroupe[categorie].efficacite])   
}

const facEffect = function(sheet: NavireSheet, categorie: string) {
    effect(function() {
        sheet.find(categorie + "_total_fac").value(sheet.feuilleEquipage.competencesGroupe[categorie].facilite())
    }, [sheet.feuilleEquipage.competencesGroupe[categorie].facilite])
}

const compFacEffect = function(sheet: NavireSheet, categorie: string) {
    effect(function() {
        sheet.find(categorie + "_fac").value(sheet.feuilleEquipage.competencesGroupe[categorie].total_facilite())
    }, [sheet.feuilleEquipage.competencesGroupe[categorie].total_facilite])
}

const modifMatelotEffect = function(sheet: NavireSheet, categorie: string) {
    effect(function() {
        if(sheet.feuilleEquipage.competencesGroupe[categorie].modif_matelot() < 0) {
            sheet.find(categorie + "_modif_sign").value("-")
        } else {
            sheet.find(categorie + "_modif_sign").value("+")
        }
        sheet.find(categorie + "_modif_matelot").value(Math.abs(sheet.feuilleEquipage.competencesGroupe[categorie].modif_matelot()))
    }, [sheet.feuilleEquipage.competencesGroupe[categorie].modif_matelot])
}

const metierEffect = function(sheet: NavireSheet, categorie: string, role: PosteBord, i: number) {
    const suffix = i > 1 ? "_" + i : ""
    effect(function() {
        log(categorie + "_" + role + "_metier" + suffix + "_val")
        sheet.find(categorie + "_" + role + "_metier" + suffix + "_val").value(sheet.feuilleEquipage.commandement[role].metier())
    }, [sheet.feuilleEquipage.commandement[role].metier])
}

const compRoll = function(sheet: NavireSheet, categorie: string, role: PosteBord, comp: string, i: number) {
    const suffix = i > 1 ? "_" + i : ""
    sheet.find(categorie + "_" + role + "_" + comp).on("click", setupRoll(
        sheet, 
        sheet.find(categorie + "_" + role + "_" + comp).text(),
        sheet.find(categorie + "_" + role + "_" + comp + "_val"), 
        sheet.find(categorie + "_" + role + "_" + "metier" + suffix + "_val"),
        sheet.feuilleEquipage.commandement[role][comp], 
        sheet.feuilleEquipage.commandement[role].metier,
        false,
        false,
        false,
        false
    ))
    
}

const handleVirtualValues = function(sheet: NavireSheet, categorie: string) {
    sheet.find(categorie + "_eff_plus").on("click", function() {
        const valCmp = sheet.find(categorie + "_eff") as Component<string>
        valCmp.value((parseInt(valCmp.value()) + 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.competencesGroupe[categorie].efficacite)
    })
    sheet.find(categorie + "_eff_min").on("click", function() {
        const valCmp = sheet.find(categorie + "_eff") as Component<string>
        valCmp.value((parseInt(valCmp.value()) - 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.competencesGroupe[categorie].efficacite)
    })
    sheet.find(categorie + "_fac_plus").on("click", function() {
        const valCmp = sheet.find(categorie + "_fac") as Component<string>
        valCmp.value((parseInt(valCmp.value()) + 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.competencesGroupe[categorie].total_facilite)
    })
    sheet.find(categorie + "_fac_min").on("click", function() {
        const valCmp = sheet.find(categorie + "_fac") as Component<string>
        valCmp.value((parseInt(valCmp.value()) - 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.competencesGroupe[categorie].total_facilite)
    })
}

const handleVirtualValuesDetail = function(sheet: NavireSheet, categorie: string, role: PosteBord, comp: string, i: number) {
    const suffix = i > 1 ? "_" + i : ""
    sheet.find(categorie + "_" + role + "_" + comp + "_plus").on("click", function() {
        const valCmp = sheet.find(categorie + "_" + role + "_" + comp + "_val") as Component<string>
        valCmp.value((parseInt(valCmp.value()) + 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.commandement[role][comp])
    })
    sheet.find(categorie + "_" + role + "_" + comp + "_min").on("click", function() {
        const valCmp = sheet.find(categorie + "_" + role + "_" + comp + "_val") as Component<string>
        valCmp.value((parseInt(valCmp.value()) - 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.commandement[role][comp])
    })
    sheet.find(categorie + "_" + role + "_metier" + suffix + "_plus").on("click", function() {
        const valCmp = sheet.find(categorie + "_" + role + "_metier" + suffix +"_val") as Component<string>
        valCmp.value((parseInt(valCmp.value()) + 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.commandement[role][comp])
    })
    sheet.find(categorie + "_" + role + "_metier" + suffix + "_min").on("click", function() {
        const valCmp = sheet.find(categorie + "_" + role + "_metier" + suffix +"_val") as Component<string>
        valCmp.value((parseInt(valCmp.value()) - 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.commandement[role][comp])
    })
}

export const displayValues = function(sheet: NavireSheet) {
    each(competencesGroupe, function(roles, key) {
        each(roles, function(comps, role) {
            for(let i=0; i<comps.length;i++) {
                valEffect(sheet, key, role as PosteBord, comps[i])
                metierEffect(sheet, key, role as PosteBord, i + 1)
                compRoll(sheet, key, role as PosteBord, comps[i], i + 1)
                handleVirtualValuesDetail(sheet, key, role as PosteBord, comps[i], i + 1)
            }
        })
        sheet.find("display_detail_" + key).on("click", handleDisplayBloc(sheet, key))
        setupCompGroupeRoll(sheet, key)
        modifMatelotEffect(sheet, key)
        effEffect(sheet, key)
        facEffect(sheet, key)
        compFacEffect(sheet, key)
        handleVirtualValues(sheet, key)
    })

    // Gestion specifique du tir
    sheet.find("tir_roll").on("click", setupRoll(
        sheet, 
        sheet.find("tir_roll").text(),
        sheet.find("tir_eff"), 
        sheet.find("tir_fac"), 
        sheet.feuilleEquipage.competencesGroupe.combat.efficacite, 
        sheet.feuilleEquipage.competencesGroupe.combat.total_facilite,
        true,
        false,
        false,
        false
    ))

    effect(function() {
        sheet.find("tir_eff").value(sheet.feuilleEquipage.competencesGroupe.combat.efficacite())
    }, [sheet.feuilleEquipage.competencesGroupe.combat.efficacite])

    effect(function() {
        sheet.find("tir_fac").value(sheet.feuilleEquipage.competencesGroupe.combat.total_facilite())
    }, [sheet.feuilleEquipage.competencesGroupe.combat.total_facilite])

    sheet.find("tir_eff_plus").on("click", function() {
        const valCmp = sheet.find("tir_eff") as Component<string>
        valCmp.value((parseInt(valCmp.value()) + 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.competencesGroupe.combat.efficacite)
    })
    sheet.find("tir_eff_min").on("click", function() {
        const valCmp = sheet.find("tir_eff") as Component<string>
        valCmp.value((parseInt(valCmp.value()) - 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.competencesGroupe.combat.efficacite)
    })
    sheet.find("tir_fac_plus").on("click", function() {
        const valCmp = sheet.find("tir_fac") as Component<string>
        valCmp.value((parseInt(valCmp.value()) + 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.competencesGroupe.combat.total_facilite)
    })
    sheet.find("tir_fac_min").on("click", function() {
        const valCmp = sheet.find("tir_fac") as Component<string>
        valCmp.value((parseInt(valCmp.value()) - 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.competencesGroupe.combat.total_facilite)
    })

}

const setupCompGroupeRoll = function(sheet: NavireSheet, categorie: string) {
    sheet.find(categorie + "_roll").on("click", setupRoll(
        sheet, 
        sheet.find(categorie + "_roll").text(),
        sheet.find(categorie + "_eff"), 
        sheet.find(categorie + "_fac"), 
        sheet.feuilleEquipage.competencesGroupe[categorie].efficacite, 
        sheet.feuilleEquipage.competencesGroupe[categorie].total_facilite,
        true,
        categorie === "canonnade",
        categorie === "recharge",
        categorie === "manoeuvre"
    ))

   
}