const table = [0.1, 0.125, 0.15, 0.2, 0.25, 0.3, 0.4, 0.5, 0.6, 0.8]

export const convertisseur = function(sheet: NavireSheet) {

    const mesureInputCmp = sheet.find("convert_mesure") as Component<string>
    const valeurInputCmp = sheet.find("convert_valeur") as Component<string>

    mesureInputCmp.on("update", function(cmp) {
        if(cmp.value() !== "-") {
            const mes = +(cmp.value()) + 0.0
            if(Number.isNaN(mes)) {
                cmp.value("-")
                valeurInputCmp.value("-")
            } else {
                const val = mesureToValeur(mes)
                if(val !== valeurInputCmp.value()) {
                    valeurInputCmp.value(val.toString())
                }
            }
        }
    })

    valeurInputCmp.on("update", function(cmp) {
        if(cmp.value() !== "-") {
            const val = +(cmp.value())
            if(Number.isNaN(val)) {
                cmp.value("-")
                mesureInputCmp.value("-")
            }
            const mes = valeurToMesure(Math.ceil(val))
            if(mes !== mesureInputCmp.value()) {
                mesureInputCmp.value(mes)
            }
        }
    })

    sheet.find("plus_col").on("click", function() {
        let valeur = +(valeurInputCmp.value())
        if(!Number.isNaN(valeur)) {
            valeurInputCmp.value((valeur + 1).toString())
        }
    })
    sheet.find("min_col").on("click", function() {
        let valeur = +(valeurInputCmp.value())
        if(!Number.isNaN(valeur)) {
            valeurInputCmp.value((valeur - 1).toString())
        }
    })
    sheet.find("plus_line").on("click", function() {
        let valeur = +(valeurInputCmp.value())
        if(!Number.isNaN(valeur)) {
            valeurInputCmp.value((valeur + 10).toString())
        }
    })
    sheet.find("min_line").on("click", function() {
        let valeur = +(valeurInputCmp.value())
        if(!Number.isNaN(valeur)) {
            valeurInputCmp.value((valeur - 10).toString())
        }
    })
}

export const valeurToMesure = function(valeur: number): string {
    let normalized = valeur
    let nbIteration = 0
    while(normalized >= 0) {
        normalized -= table.length
        nbIteration++
    }
    for(let i=0; i<table.length; i++) {
        if(normalized === i - table.length) {
            return (table[i] * Math.pow(10, nbIteration)).toString();
        }
        valeur++
    }
    return "-"
}

export const mesureToValeur = function(mesure: number): string {
    let normalized = mesure;
    let nbIteration = 0
    if(mesure <= 0) {
        return "-"
    }
    while(normalized > 0.8) {
        normalized = normalized / 10
        nbIteration++
    }
    let valeur = -10
    for(let i=0; i<table.length; i++) {
        if(normalized <= table[i]) {
            return (valeur + (10 * nbIteration)).toString();
        }
        valeur++
    }
    return "-"
}