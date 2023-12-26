import { competencesGroupe } from "../globals"
import { effect, intToWord, signal } from "../utils/utils"

export const setDetailCompetenceGroup = function(sheet: NavireSheet) {

    sheet.find("display_detail_combat").on("click", handleDisplayBloc(sheet, "combat"))
    sheet.find("display_detail_tir").on("click", handleDisplayBloc(sheet, "combat"))
    sheet.find("display_detail_manoeuvre").on("click", handleDisplayBloc(sheet, "manoeuvre"))
    sheet.find("display_detail_habilete").on("click", handleDisplayBloc(sheet, "habilete"))
    sheet.find("display_detail_ruse").on("click", handleDisplayBloc(sheet, "ruse"))
    sheet.find("display_detail_canonnade").on("click", handleDisplayBloc(sheet, "canonnade"))
    sheet.find("display_detail_recharge").on("click", handleDisplayBloc(sheet, "recharge"))

}

const handleDisplayBloc = function(sheet: NavireSheet, bloc: string) {
    return function() {
        const blocs: Record<string, Component> = {
            "combat": sheet.find("combat_detail_row"),
            "manoeuvre": sheet.find("manoeuvre_detail_row"),
            "habilete": sheet.find("habilete_detail_row"),
            "ruse": sheet.find("ruse_detail_row"),
            "canonnade": sheet.find("canonnade_detail_row"),
            "recharge": sheet.find("recharge_detail_row"),
        }
        each(blocs, function(cmp, key) {
            if(key === bloc) {
                cmp.show()
            } else {
                cmp.hide()
            }
        })
    }
}

const setupRoll = function(sheet: NavireSheet, eff: Component, fac: Component) {
    return function() {
        let dice = "10"
        let nDice = eff.value()
        if(nDice<=0) {
            dice = "12"
            nDice = 1
        }
        new RollBuilder(sheet.raw()).expression("(" + nDice + "d" + dice + " <={1:2} " + fac.value() + ")[eff_" + intToWord(eff.value()) + ",fac_" + intToWord(fac.value()) + "]").roll()
    }
}

export const setupCompGroupeRolls = function(sheet: NavireSheet) {
    sheet.find("combat_roll").on("click", setupRoll(sheet, sheet.find("combat_eff"), sheet.find("combat_fac")))
    sheet.find("canonnade_roll").on("click", setupRoll(sheet, sheet.find("canonnade_eff"), sheet.find("canonnade_fac")))
    sheet.find("recharge_roll").on("click", setupRoll(sheet, sheet.find("recharge_eff"), sheet.find("recharge_fac")))
    sheet.find("manoeuvre_roll").on("click", setupRoll(sheet, sheet.find("manoeuvre_eff"), sheet.find("manoeuvre_fac")))
    sheet.find("habilete_roll").on("click", setupRoll(sheet, sheet.find("habilete_eff"), sheet.find("habilete_fac")))
    sheet.find("ruse_roll").on("click", setupRoll(sheet, sheet.find("ruse_eff"), sheet.find("ruse_fac")))
    sheet.find("tir_roll").on("click", setupRoll(sheet, sheet.find("tir_eff"), sheet.find("tir_fac")))
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
        sheet, sheet.find(categorie + "_" + role + "_" + comp + "_val"), 
        sheet.find(categorie + "_" + role + "_" + "metier" + suffix + "_val")
    ))
}

const handleVirtualValues = function(sheet: NavireSheet, categorie: string) {
    sheet.find(categorie + "_eff_plus").on("click", function() {})
    sheet.find(categorie + "_eff_min").on("click", function() {})
    sheet.find(categorie + "_fac_plus").on("click", function() {})
    sheet.find(categorie + "_fac_min").on("click", function() {})
}

const handleVirtualValuesDetail = function(sheet: NavireSheet, categorie: string, role: PosteBord, comp: string, i: number) {
    const suffix = i > 1 ? "_" + i : ""
    sheet.find(categorie + "_" + role + "_" + comp + "_plus").on("click", function() {})
    sheet.find(categorie + "_" + role + "_" + comp + "_min").on("click", function() {})
    sheet.find(categorie + "_" + role + "_metier" + suffix + "_plus").on("click", function() {})
    sheet.find(categorie + "_" + role + "_metier" + suffix + "_min").on("click", function() {})
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
        modifMatelotEffect(sheet, key)
        effEffect(sheet, key)
        facEffect(sheet, key)
        compFacEffect(sheet, key)
        handleVirtualValues(sheet, key)
    })
}