export const rollResultHandler = function(result: DiceResult, callback: DiceResultCallback) {
    callback('DiceResult', function(sheet: Sheet<unknown>) {
        if(result.containsTag("attack")) {
            const res = result.children[0]
            log(result.children[0].children[0].total)
            log(result.children[0].children[1].total)
            sheet.get("result").text(res.children[0].total.toString() + " succès")
            sheet.get("localisation").text(Tables.get("localisations").get(res.children[1].total.toString()).name)
        } else if(result.containsTag("sequelle")) {
            handleSequelle(sheet, result)
        } else {
            sheet.get("result").text(result.total.toString() + " succès")
        }
    })
}

export const handleSequelle = function(sheet: Sheet, result: DiceResult) {
    const sequelle = getSequelleData(result.total, result.tags)
    if(sequelle !== undefined) {
        sheet.get("result").text(sequelle.short_description)
    }
}

export const mapSequelle = function(e: SequelleEntity): Sequelle {
    return  {
        min: parseInt(e.min),
        max: parseInt(e.max),
        short_description: e.short_description,
        description: e.description,
        effect: e.effect
    }
}

export const getSequelleData = function(total: number, tags: string[]) {
    let table: Table<SequelleEntity> | undefined = undefined
    let localisation: string | undefined = undefined
    if(tags.indexOf('tete') !== -1) {
        table = Tables.get("sequelles_tete")
        localisation = _("Tête")
    } else if(tags.indexOf('torse') !== -1) {
        table = Tables.get("sequelles_torse")
        localisation = _("Torse")
    } else if(tags.indexOf('bras_droit') !== -1) {
        table = Tables.get("sequelles_bras")
        localisation = _("Bras droit")
    } else if(tags.indexOf('bras_gauche') !== -1) {
        table = Tables.get("sequelles_bras")
        localisation = _("Bras gauche")
    } else if(tags.indexOf('jambe_droite') !== -1) {
        table = Tables.get("sequelles_jambe")
        localisation = _("Jambe droite")
    } else if(tags.indexOf('jambe_gauche') !== -1) {
        table = Tables.get("sequelles_jambe")
        localisation = _("Jambe gauche")
    } else {
        log("Unknown sequelle type")
        return undefined
    }
    const sequelle: Sequelle[] = []
    table.each(function(e) {
        const currSequelle = mapSequelle(e)
        currSequelle.localisation = localisation
        if(total >= currSequelle.min && total <= currSequelle.max) {
            sequelle.push(currSequelle)
        }
    })
    if(sequelle.length > 0) {
        return sequelle[0]
    }
    log("Sequelle not found")
    return undefined
}