import { mesureToValeur } from "../navire/convertisseur"

export const gestionNombre = function(sheet: NavireSheet) {
    const mesureValidesCmp = sheet.find("mesure_valides") as Component<number>
    const valeurValidesCmp = sheet.find("valeur_valides") as Component<string>
    const mesureSoinsCmp = sheet.find("mesure_soins") as Component<number>
    const valeurSoinsCmp = sheet.find("valeur_soins") as Component<string>
    const mesureTotalCmp = sheet.find("mesure_total") as Component<string>
    const valeurTotalCmp = sheet.find("valeur_total") as Component<string> 
    valeurValidesCmp.value(mesureToValeur(mesureValidesCmp.value()))
    valeurSoinsCmp.value(mesureToValeur(mesureSoinsCmp.value()))
    mesureTotalCmp.value((mesureValidesCmp.value() + mesureSoinsCmp.value()).toString())
    valeurTotalCmp.value(mesureToValeur(parseInt(mesureTotalCmp.value())))
    mesureValidesCmp.on("update", function(cmp) {
        valeurValidesCmp.value(mesureToValeur(cmp.value()))
        mesureTotalCmp.value((cmp.value() + mesureSoinsCmp.value()).toString())
        valeurTotalCmp.value(mesureToValeur(parseInt(mesureTotalCmp.value())))
    })
    mesureSoinsCmp.on("update", function(cmp) {
        valeurSoinsCmp.value(mesureToValeur(cmp.value()))
        mesureTotalCmp.value((cmp.value() + mesureValidesCmp.value()).toString())
        valeurTotalCmp.value(mesureToValeur(parseInt(mesureTotalCmp.value())))
    })
    
}