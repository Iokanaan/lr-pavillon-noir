import { globalSheets } from "../globals"
import { computed, effect, signal } from "../utils/utils"

export const setupJournalPagination = function(sheet: PavillonSheet) {
    const items: Signal<string[]> = signal([])
    const numPage = signal(sheet.find("num_page").value() as number)
    const numPageCmp = sheet.find("num_page") as Component<number>
    numPageCmp.on("update", function(cmp) {
        if(cmp.value() > sheet.journalMaxPage()) {
            numPageCmp.value(sheet.journalMaxPage())
        } else {
            numPage.set(cmp.value() as number)
        }
    })

    sheet.find("journal_start").on("click", function() {
        numPageCmp.value(1)   
    })

    sheet.find("journal_min").on("click", function() {
        numPageCmp.value(numPageCmp.value() - 1)   
    })

    sheet.find("journal_end").on("click", function() {
        numPageCmp.value(sheet.journalMaxPage())   
    })

    sheet.find("journal_plus").on("click", function() {
        numPageCmp.value(numPageCmp.value() + 1)  
    })

    sheet.find("page_size").on("update", function(cmp) {
        sheet.journalPageSize.set(cmp.value() as number)   
    })


    effect(function() {
        if(sheet.find("total_page").value() !== sheet.journalMaxPage()) {
            sheet.find("total_page").value(sheet.journalMaxPage())
        }
        if(numPageCmp.value() > sheet.journalMaxPage()) {
            numPageCmp.value(sheet.journalMaxPage())
        }
    }, [sheet.journalMaxPage])

    effect(function() {
        const repeater = sheet.find("journal_repeater") as Component<Record<string, unknown>>
        const keys = Object.keys(sheet.journal())
        for(let i=0; i<keys.length; i++) {
            const item = repeater.find(keys[i])
            if(i < numPage() * sheet.journalPageSize() && i >= (numPage() - 1) * sheet.journalPageSize()) {
                item.show()
            } else {
                item.hide()
            }
        }
    }, [sheet.journal, numPage, sheet.journalPageSize])



}

export const setupJournalDisplayEntry = function(entry: Component) {
    const sheet = globalSheets[entry.sheet().getSheetId()]
    const journal = sheet.journal()
    journal[entry.id()] = entry.value()
    sheet.journal.set(journal)
    if(sheet.find("num_page").value() !== sheet.journalMaxPage()) {
        sheet.find("num_page").value(sheet.journalMaxPage())
    }
}

export const onJournalDelete = function(sheet: PavillonSheet) {
    return function(entryId: string) {
        const journal = sheet.journal()
        delete journal[entryId]
        sheet.journal.set(journal)
    }
}