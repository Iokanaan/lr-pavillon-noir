import { effect, signal } from "../utils/utils"

export const setupSequellesEditEntry = function(entry: Component) {
    const loc = signal(entry.find("localisation_choice").text())
    entry.find("localisation_choice").on("update", function(cmp) {
        loc.set(cmp.text())
    })
    effect(function() {
        entry.find("localisation").value(loc())
    }, [loc])
}