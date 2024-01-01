import { effect } from "../utils/utils"

export const santeEquipage = function(nSheet: NavireSheet) {
    effect(function() {
        const nbCases = 4 + nSheet.feuilleEquipage.santeMax()
        for(let i=1;i<=8;i++) {
            if(i <= nbCases) {
                log("showing" +  " sante_" + i)
                nSheet.find("sante_" + i).show()
            } else {
                log("hding" +  " sante_" + i)
                nSheet.find("sante_" + i).hide()
                if(nSheet.find("sante_" + i).value() === true) {
                    nSheet.find("sante_" + i).value(false)
                }
            }
        } 
        if(!nSheet.find("sante_4").visible() && !nSheet.find("sante_5").visible()) {
            nSheet.find("sante_legere").hide()
        } else {
            nSheet.find("sante_legere").show()
        }
        if(!nSheet.find("sante_3").visible() && !nSheet.find("sante_6").visible()) {
            nSheet.find("sante_serieuse").hide()
        } else {
            nSheet.find("sante_serieuse").show()
        }
        if(!nSheet.find("sante_2").visible() && !nSheet.find("sante_7").visible()) {
            nSheet.find("sante_grave").hide()
        } else {
            nSheet.find("sante_grave").show()
        }
        if(!nSheet.find("sante_1").visible() && !nSheet.find("sante_8").visible()) {
            nSheet.find("sante_critique").hide()
        } else {
            nSheet.find("sante_critique").show()
        }
    }, [nSheet.feuilleEquipage.santeMax])

    effect(function() {
        nSheet.find("malus_sante").value("Malus : " + nSheet.feuilleEquipage.malusSante())
    }, [nSheet.feuilleEquipage.malusSante])

    nSheet.find("sante_1").on("update", function(cmp) {
        nSheet.feuilleEquipage.detailSante.critique[0].set(cmp.value() as boolean)
    })

    nSheet.find("sante_2").on("update", function(cmp) {
        nSheet.feuilleEquipage.detailSante.grave[0].set(cmp.value() as boolean)
    })

    nSheet.find("sante_3").on("update", function(cmp) {
        nSheet.feuilleEquipage.detailSante.serieuse[0].set(cmp.value() as boolean)
    })

    nSheet.find("sante_4").on("update", function(cmp) {
        nSheet.feuilleEquipage.detailSante.legere[0].set(cmp.value() as boolean)
    })

    nSheet.find("sante_5").on("update", function(cmp) {
        nSheet.feuilleEquipage.detailSante.legere[1].set(cmp.value() as boolean)
    })

    nSheet.find("sante_6").on("update", function(cmp) {
        nSheet.feuilleEquipage.detailSante.serieuse[1].set(cmp.value() as boolean)
    })

    nSheet.find("sante_7").on("update", function(cmp) {
        nSheet.feuilleEquipage.detailSante.grave[1].set(cmp.value() as boolean)
    })

    nSheet.find("sante_8").on("update", function(cmp) {
        nSheet.feuilleEquipage.detailSante.critique[1].set(cmp.value() as boolean)
    })

    const seqRow1 = nSheet.find('sequelles_equipage_row_1') as Component<null>
    const seqRow2 = nSheet.find('sequelles_equipage_row_2') as Component<null>
    const titleCmp = nSheet.find('sequelles_equipage_title') as Component<string>
    seqRow1.hide()
    seqRow2.hide()
    titleCmp.on('click', function() {
        if(seqRow1.visible()) {
            seqRow1.hide()
            seqRow2.hide()
        } else {
            seqRow1.show()
            seqRow2.show()
        }
    })
}

