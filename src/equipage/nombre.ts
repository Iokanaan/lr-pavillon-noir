import { mesureToValeur } from "../navire/convertisseur"
import { effect } from "../utils/utils"

export const gestionNombre = function(sheet: NavireSheet) {
    const mesureValidesCmp = sheet.find("mesure_valides") as Component<string>
    const valeurValidesCmp = sheet.find("valeur_valides") as Component<string>
    const mesureSoinsCmp = sheet.find("mesure_soins") as Component<number>
    const valeurSoinsCmp = sheet.find("valeur_soins") as Component<string>
    const mesureTotalCmp = sheet.find("mesure_total") as Component<number>
    const valeurTotalCmp = sheet.find("valeur_total") as Component<string> 
    valeurTotalCmp.value(mesureToValeur(mesureTotalCmp.value()))
    valeurSoinsCmp.value(mesureToValeur(mesureSoinsCmp.value()))
    mesureValidesCmp.value((mesureTotalCmp.value() - mesureSoinsCmp.value()).toString())
    valeurValidesCmp.value(mesureToValeur(parseInt(mesureValidesCmp.value())))
    mesureTotalCmp.on("update", function(cmp) {
        valeurTotalCmp.value(mesureToValeur(cmp.value()))
        mesureValidesCmp.value((cmp.value() - mesureSoinsCmp.value()).toString())
        valeurValidesCmp.value(mesureToValeur(parseInt(mesureValidesCmp.value())))
        sheet.equipage.actuel.set(cmp.value())
    })
    mesureSoinsCmp.on("update", function(cmp) {
        valeurSoinsCmp.value(mesureToValeur(cmp.value()))
        mesureValidesCmp.value((mesureTotalCmp.value() - cmp.value()).toString())
        valeurValidesCmp.value(mesureToValeur(parseInt(mesureValidesCmp.value())))
        sheet.equipage.soins.set(cmp.value())
    })
    effect(function() {
        sheet.find("malus_recharge").value("Malus regarge : " + sheet.equipage.malusRecharge())
    }, [sheet.equipage.malusRecharge])
}