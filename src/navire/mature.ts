import { effect } from "../utils/utils"


export const setupEtatMature = function(sheet: NavireSheet) {
    
    sheet.find("structure_mat_title").on("click", function(cmp) {
        if(sheet.find("structure_mat_label").visible()) {
            sheet.find("structure_mat_label").hide()
            sheet.find("structure_mat_input").show()
        } else {
            sheet.find("structure_mat_label").show()
            sheet.find("structure_mat_input").hide()
        }
    })

    sheet.find("structure_mat_input").on("update", function(cmp) {
        cmp.hide()
        sheet.find("structure_mat_label").show()
        if(cmp.value() !== "") {
            sheet.find("structure_mat_label").value(cmp.value())
        } else {
            sheet.find("structure_mat_label").value(" ")
        }
        sheet.structure.maxMat.set(+(cmp.value() as string))
    })

    sheet.find("reset_mat").on("click", function() {
        sheet.find("structure_grand_mat_input").value(sheet.structure.maxMat())
        sheet.find("structure_artimon_input").value(sheet.structure.maxMat())
        sheet.find("structure_misaine_input").value(sheet.structure.maxMat())
    })

    effect(function() {
        sheet.find("degats_artimon").value(sheet.structure.mat.artimon.degats())
    }, [sheet.structure.mat.artimon.degats])
    effect(function() {
        sheet.find("degats_misaine").value(sheet.structure.mat.misaine.degats())
    }, [sheet.structure.mat.misaine.degats])
    effect(function() {
        sheet.find("degats_mat").value(sheet.structure.mat.mat.degats())
    }, [sheet.structure.mat.mat.degats])

    sheet.find("structure_misaine_input").on("update", function(cmp) {
        sheet.structure.mat.misaine.ps.set(cmp.value() as number)
    })
    sheet.find("structure_artimon_input").on("update", function(cmp) {
        sheet.structure.mat.artimon.ps.set(cmp.value() as number)
    })
    sheet.find("structure_grand_mat_input").on("update", function(cmp) {
        sheet.structure.mat.mat.ps.set(cmp.value() as number)
    })

    effect(function() {
        sheet.find("etat_mature_label").value(sheet.structure.degatsMature())
    }, [sheet.structure.degatsMature])

    effect(function() {
        sheet.find("malus_mature").value("Malus : " + sheet.structure.malusMature())
    },[sheet.structure.malusMature])
}

export const toggleMature = function(sheet: NavireSheet) {

    const useMisaineCmp = sheet.find("use_misaine") as Component<boolean>
    const useMatCmp = sheet.find("use_mat") as Component<boolean>
    const useArtimonCmp = sheet.find("use_artimon") as Component<boolean>

    effect(function() {
        if(sheet.mature.artimon()) {
            sheet.find("toggle_artimon").value(":toggle-on:")
            sheet.find("col_artimon").removeClass("opacity-25")
        } else {
            sheet.find("toggle_artimon").value(":toggle-off:")
            sheet.find("col_artimon").addClass("opacity-25")
        }
    },[sheet.mature.artimon])

    effect(function() {
        if(sheet.mature.mat()) {
            sheet.find("toggle_mat").value(":toggle-on:")
            sheet.find("col_mat").removeClass("opacity-25")
        } else {
            sheet.find("toggle_mat").value(":toggle-off:")
            sheet.find("col_mat").addClass("opacity-25")
        }
    },[sheet.mature.mat])

    effect(function() {
        if(sheet.mature.misaine()) {
            sheet.find("toggle_misaine").value(":toggle-on:")
            sheet.find("col_misaine").removeClass("opacity-25")
        } else {
            sheet.find("toggle_misaine").value(":toggle-off:")
            sheet.find("col_misaine").addClass("opacity-25")
        }
    },[sheet.mature.misaine])

    sheet.find("toggle_misaine").on("click", function() {
        useMisaineCmp.value(!useMisaineCmp.value())
    })

    sheet.find("toggle_mat").on("click", function() {
        useMatCmp.value(!useMatCmp.value())
    })

    sheet.find("toggle_artimon").on("click", function() {
        useArtimonCmp.value(!useArtimonCmp.value())
    })

    useMisaineCmp.on("update", function(cmp) {
        sheet.mature.misaine.set(cmp.value())
    })

    useMatCmp.on("update", function(cmp) {
        sheet.mature.mat.set(cmp.value())
    })

    useArtimonCmp.on("update", function(cmp) {
        sheet.mature.artimon.set(cmp.value())
    })

    effect(function() { 
        const artimon = sheet.mature.artimon()
        const mat = sheet.mature.mat()
        const misaine = sheet.mature.misaine()
        const misaineTitleCmp = sheet.find("misaine_title")
        const matTitleCmp = sheet.find("mat_title")
        const artimonTitleCmp = sheet.find("artimon_title")
        if(artimon && mat && misaine) {
            artimonTitleCmp.value("**1 : Artimon**")
            matTitleCmp.value("**2-5 : Grand Mât**")
            misaineTitleCmp.value("**6 : Misaine**")
        }
        if(artimon && mat && !misaine) {
            artimonTitleCmp.value("**1-2 : Artimon**")
            matTitleCmp.value("**3-6 : Grand Mât**")
            misaineTitleCmp.value("**Misaine**")
        }
        if(!artimon && mat && misaine) {
            artimonTitleCmp.value("**Artimon**")
            matTitleCmp.value("**1-4 : Grand Mât**")
            misaineTitleCmp.value("**5-6 : Misaine**")
        }
        if(artimon && !mat && misaine) {
            artimonTitleCmp.value("**1-3 : Artimon**")
            matTitleCmp.value("**Grand Mât**")
            misaineTitleCmp.value("**4-6 : Misaine**")
        }
        if(!artimon && !mat && !misaine) {
            artimonTitleCmp.value("**Artimon**")
            matTitleCmp.value("**Grand Mât**")
            misaineTitleCmp.value("**Misaine**")
        }
        if(artimon && !mat && !misaine) {
            artimonTitleCmp.value("**1-6 : Artimon**")
            matTitleCmp.value("**Grand Mât**")
            misaineTitleCmp.value("**Misaine**")
        }
        if(!artimon && !mat && misaine) {
            artimonTitleCmp.value("**Artimon**")
            matTitleCmp.value("**Grand Mât**")
            misaineTitleCmp.value("**1-6 : Misaine**")
        }
        if(!artimon && mat && !misaine) {
            artimonTitleCmp.value("**Artimon**")
            matTitleCmp.value("**1-6 : Grand Mât**")
            misaineTitleCmp.value("**Misaine**")
        }
        if(!artimon && !mat && !misaine) {
            artimonTitleCmp.value("**Artimon**")
            matTitleCmp.value("**Grand Mât**")
            misaineTitleCmp.value("**Misaine**")
        }
    }, [sheet.mature.artimon, sheet.mature.misaine, sheet.mature.mat])
}

export const setupVoilure = function(sheet: NavireSheet) {
    sheet.find("voilure_choice").on("update", function(cmp) {
        sheet.structure.voilure.set(cmp.value() as string)
    })
    effect(function() {
        sheet.find("modif_voilure_vitesse_val").value(sheet.structure.modifVoilureVitesse())
    }, [sheet.structure.modifVoilureVitesse])
    effect(function() {
        sheet.find("modif_voilure_manoeuvre_val").value(sheet.structure.modifVoilureManoeuvre())
    }, [sheet.structure.modifVoilureManoeuvre])
}