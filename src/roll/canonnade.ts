import { parseIntTag } from "./rollHandler"

export const handleCanonnade = function(sheet: Sheet, result: DiceResult) {
    sheet.get("result").text(result.children[0].total.toString() + " succès")
    const locCoque = getLocalisationCoque(result.children[1].total)
    const locMat = getLocalisationMature(result.children[1].total, result.allTags)
    if(locMat !== undefined) {
        sheet.get("localisation").text(locCoque + " / " + locMat)
    } else {
        sheet.get("localisation").text(locCoque)
    }
}

const getLocalisationCoque = function(loc: number) {
    switch(loc) {
        case 1:
            return "Poupe"
        case 6:
            return "Proue"
        default:
            return "Entrepont"
    }
}

const getLocalisationMature = function(loc: number, tags: string[]) {
    const mat = tags.indexOf("mat") !== -1
    const artimon= tags.indexOf("artimon") !== -1
    const misaine = tags.indexOf("misaine") !== -1
    return getLocalisationMap(misaine, artimon, mat)[loc]
}

const getLocalisationMap = function(misaine: boolean, artimon: boolean, mat: boolean): Record<number, string | undefined> {
    if(mat && artimon && misaine) {
        return {
            1: "Artimon",
            2: "Grand mât",
            3: "Grand mât",
            4: "Grand mât",
            5: "Grand mât",
            6: "Misaine",
        }
    }
    if(!mat && artimon && misaine) {
        return {
            1: "Artimon",
            2: "Artimon",
            3: "Artimon",
            4: "Misaine",
            5: "Misaine",
            6: "Misaine",
        }
    }
    if(mat && !artimon && misaine) {
        return {
            1: "Grand mât",
            2: "Grand mât",
            3: "Grand mât",
            4: "Grand mât",
            5: "Misaine",
            6: "Misaine",
        }
    }
    if(mat && artimon && !misaine) {
        return {
            1: "Artimon",
            2: "Artimon",
            3: "Grand mât",
            4: "Grand mât",
            5: "Grand mât",
            6: "Grand mât",
        }
    }
    if(mat && !artimon && !misaine) {
        return {
            1: "Grand mât",
            2: "Grand mât",
            3: "Grand mât",
            4: "Grand mât",
            5: "Grand mât",
            6: "Grand mât",
        }
    }
    if(!mat && artimon && !misaine) {
        return {
            1: "Artimon",
            2: "Artimon",
            3: "Artimon",
            4: "Artimon",
            5: "Artimon",
            6: "Artimon",
        }
    }
    if(!mat && !artimon && misaine) {
        return {
            1: "Misaine",
            2: "Misaine",
            3: "Misaine",
            4: "Misaine",
            5: "Misaine",
            6: "Misaine",
        }
    }
    return {
        1: undefined,
        2: undefined,
        3: undefined,
        4: undefined,
        5: undefined,
        6: undefined,
    }
}