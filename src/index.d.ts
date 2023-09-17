//@ts-check

declare global { 

    interface Signal<T> {
        (): T;
        set(t:T)
        subscribe(t:Handler<T>): () => void;
    }
    
    interface Computed<T> {
        (): T;
        subscribe(t:Handler<T>): () => void;
    }

    type Handler<T> = (t: T) => void

    type RepeaterState = 'EDIT' | 'VIEW'

    interface ExtendedSheet<T> {
        raw(): Sheet<T>,
        find(id: string): Component<unknown> | ChoiceComponent<unknown>,
        stringId(): string
    }

    type PavillonSheet = {
        entryStates: Record<string, Record<string, RepeaterState | undefined>>,
        selectedComp: Signal<Competence | undefined>
    } & ExtendedSheet<CharData>

    type Competence = {
        id: string,
        name: string
    }
    
    type Attribut = {
        id: string,
        name: string
    }

} 

export {}
