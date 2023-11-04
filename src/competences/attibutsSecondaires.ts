import { effect } from "../utils/utils";

export const setupAttrSecondaires = function(sheet: PavillonSheet) {

    // Gestion du clic sur chance
    sheet.find("chance_label").on("click", function(cmp) {
        cmp.hide()
        sheet.find("chance_facilite_row").show()
    });

    // Lancement du dé sur la mise à jour de la facilité
    (sheet.find("chance_facilite_input") as Component<string>).on("update", function(cmp) {
        if(/^[0-9]*$/.test(cmp.value())) {
            new RollBuilder(sheet.raw()).expression("1d10 <=1 " + (parseInt(cmp.value()) + sheet.chance())).roll()
            sheet.find("chance_facilite_row").hide()
            sheet.find("chance_facilite_input").value(null)
            sheet.find("chance_label").show()
        }
    })

    // Effet d'écriture du label en fonction de la chance enregistrée sur la feuille
    effect(function() {
        sheet.find("chance_val").text(sheet.chance().toString())
    }, [sheet.chance])

    // Effet d'écriture du label en fonction de la chance enregistrée sur la feuille
    effect(function() {
        sheet.find("initiative_val").text(sheet.initiative().toString())
    }, [sheet.initiative])

    // Ajout de l'initiative à la table
    sheet.find("initiative_label").on("click", function() {
        new RollBuilder(sheet.raw()).expression("(" + sheet.find("initiative_val").value() as string  + ")[initiative]").title("Initiative").roll()
    })

    // Effet d'écriture de MDAfr MDFor en fonction des modificateurs enregistrés sur la feuille
    each(sheet.modifiers, function(modSignal, key) {
        effect(function() {
            sheet.find(key + "_val").text(modSignal().toString())
        }, [modSignal])
    })

    // Effet d'écriture des valeurs de commandement en fonction des valeurs enregistrées sur la feuille
    each(sheet.commandement, function(cmdSignal, key) {
        effect(function() {
            sheet.find(key + "_val").text(cmdSignal().toString())
        }, [cmdSignal])
    })
}

export const setupValeurMetier = function(sheet: PavillonSheet) {

    // Afficher la profession si elle est définie, la cacher sinon
    const setDisplay = function(labelCmpId: string, valCmpId: string, subTextCmpId: string, profession: Profession | undefined) {
        if(profession !== undefined) {
            sheet.find(labelCmpId).value(profession.name)
            sheet.find(subTextCmpId).value("(" + profession.attr_1 + " + " + profession.attr_2 + ") / 2")
            sheet.find(subTextCmpId).show()
            sheet.find(labelCmpId).show()
            sheet.find(valCmpId).show()
        } else {
            sheet.find(labelCmpId).hide()
            sheet.find(subTextCmpId).hide()
            sheet.find(valCmpId).hide()
        }
    }

    // Afficher la valeur du métier
    const setValue = function(valCmpId: string, value: number | undefined) {
        if(value !== undefined) {
            sheet.find(valCmpId).value(value.toString())
        } else {
            sheet.find(valCmpId).value("0")
        }
    }

    // Affichage du libellé du poste à bord
    effect(function() {
        setDisplay( "valeur_poste_bord_label_1", "valeur_poste_bord_val_1", "poste_bord_1_subtext", sheet.posteBord.profession())
    }, [sheet.posteBord.profession])

    // Affichage de la valeur poste à bord
    effect(function() {
        setValue("valeur_poste_bord_val_1", sheet.posteBord.value())
    }, [sheet.posteBord.value])

    // Affichage du libellé métier 1
    effect(function() {
        setDisplay("valeur_metier_label_1", "valeur_metier_val_1", "metier_1_subtext", sheet.professions[0].profession())
    }, [sheet.professions[0].profession])

    // Affichage de la valeur métier 1
    effect(function() {
        setValue("valeur_metier_val_1", sheet.professions[0].value())
    }, [sheet.professions[0].value])

    // Affichage du libellé métier 2
    effect(function() {
        setDisplay("valeur_metier_label_2", "valeur_metier_val_2", "metier_2_subtext", sheet.professions[1].profession())
    }, [sheet.professions[1].profession])

    // Affichage de la valeur métier 2
    effect(function() {
        setValue("valeur_metier_val_2", sheet.professions[1].value())
    }, [sheet.professions[1].value])
}