const table = [0.1, 0.125, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8]
const pivot = -10

export const convertisseur = function(sheet: NavireSheet) {
    sheet.find("convert_mesure").on("update", function(cmp) {
        sheet.find("result_mesure").value(mesureToValeur(+(cmp.value()) + 0.0))
    })
}

export const valeurToMesure = function(valeur: number) {

}

export const mesureToValeur = function(mesure: number): number {
    let normalized = mesure;
    let nbIteration = 0
    while(normalized > 0.8) {
        normalized = normalized / 10
        nbIteration++
    }
    log(normalized)
    let valeur = pivot
    for(let i=0; i<table.length; i++) {
        if(normalized <= table[i]) {
            return valeur + (10 * nbIteration);
        }
        valeur++
    }
    // should never happen
    return 0
}