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

const setupRoll = function(sheet: NavireSheet, title: string, eff: Component, fac: Component, baseEffSignal: Signal<number> | Computed<number>, baseFacSignal: Signal<number> | Computed<number>, flagLoc: boolean) {
    return function() {
        log(fac.id())
        let dice = "10"
        let nDice = eff.value()
        if(nDice<=0) {
            dice = "12"
            nDice = 1
        }
        let expression = "(" + nDice + "d" + dice + " <={1:2} " + fac.value() + ")[eff_" + intToWord(eff.value()) + ",fac_" + intToWord(fac.value()) + "]"
        if(flagLoc) {
            let tagLoc = "localisation_navire"
            if(sheet.mature.artimon()) {
                tagLoc += ",artimon"
            }
            if(sheet.mature.misaine()) {
                tagLoc += ",misaine"
            }
            if(sheet.mature.mat()) {
                tagLoc += ",mat"
            }
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
        sheet.find(categorie + "_fac").value(sheet.feuilleEquipage.competencesGroupe[categorie].facilite() + sheet.feuilleEquipage.competencesGroupe[categorie].modif_matelot())
    }, [
        sheet.feuilleEquipage.competencesGroupe[categorie].facilite,
        sheet.feuilleEquipage.competencesGroupe[categorie].modif_matelot
    ])
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
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.competencesGroupe[categorie].facilite)
    })
    sheet.find(categorie + "_fac_min").on("click", function() {
        const valCmp = sheet.find(categorie + "_fac") as Component<string>
        valCmp.value((parseInt(valCmp.value()) - 1).toString())
        setVirtualColorFromSignal(valCmp, sheet.feuilleEquipage.competencesGroupe[categorie].facilite)
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
                metierEffect(sheet, key, role as PosteBord, i)
                compRoll(sheet, key, role as PosteBord, comps[i], i)
                handleVirtualValuesDetail(sheet, key, role as PosteBord, comps[i], i)
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
}

const setupCompGroupeRoll = function(sheet: NavireSheet, categorie: string) {
    log(categorie)
    sheet.find(categorie + "_roll").on("click", setupRoll(
        sheet, 
        sheet.find(categorie + "_roll").text(),
        sheet.find(categorie + "_eff"), 
        sheet.find(categorie + "_fac"), 
        sheet.feuilleEquipage.competencesGroupe[categorie].efficacite, 
        sheet.feuilleEquipage.competencesGroupe[categorie].facilite,
        categorie === "canonnade"
    ))
}