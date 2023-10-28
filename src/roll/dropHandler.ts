import { globalSheets } from "../globals"
import { setupSequellesEditEntry } from "../personnage/sequelles"
import { reset } from "../utils/repeaters"
import { getSequelleData } from "./sequelles"

export const dropSequelle = function(to: Sheet, total: number, tags: string[]) {
    const sequelle = getSequelleData(total, tags)
    const allSequelles = to.get("sequelles_repeater").value() 
    allSequelles[Math.random().toString().slice(2).substring(0, 10)] = sequelle
    to.setData({"sequelles_repeater": allSequelles})
    reset(globalSheets[to.getSheetId()], "sequelles_repeater", setupSequellesEditEntry, null)
}