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
        selectedComp: Signal<Competence | undefined>,
        professions: Signal<Profession | undefined>[],
        posteBord: Signal<Profession | undefined>,
        attr: Record<string, Signal<number>>
        reputation: Record<"glo" | "inf", Computed<number>>
    } & ExtendedSheet<CharData>

    type Competence = {
        id: string,
        name: string,
        cc: boolean,
        metier: boolean,
    }

    type CompetenceEntity = {
        id: string,
        name: string,
        cc: string,
        metier: string
    }

    type Attribut = {
        id: string,
        name: string
    }
    
    type AttributEntity = {
        id: string,
        name: string
    }

    type ProfessionEntity = {
        id: string,
        name: string, 
        attr_1: string,
        attr_2: string,
        type: string
    }

    type ReputationEntity = {
        id: string,
        name: string   
    }

    type Profession = {
        name: string, 
        attr_1: string,
        attr_2: string
    }

    type ProfessionTypeEntity = {
        id: string,
        name: string
    }

    type ProfessionType = {
        id: string,
        name: string
    }

    type AvantageEntity = {
        id: string,
        name: string
    }

    type Avantage = {
        id: string,
        name: string
    }
} 

export {}
