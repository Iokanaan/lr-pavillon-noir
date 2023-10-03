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
        modifiers: Record<Modificateur, Computed<number>>
        comp: Record<string, Signal<number>>
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

    type CompetenceCombatEntity = {
        id: string,
        name: string
    }

    type TypeArme = "cac" | "feu" | "jet" | "trait"
    type AttributEnum = "ADR" | "ADA" | "RES" | "FOR" | "ERU" | "PER" | "EXP" | "CHA" | "POU"
    type Modificateur = "MDFor" | "MDAdr"
    type LongueurArme = "courte" | "longue" | "tres_longue"

    type WeaponEntity = {
        id: string,
        attr: Attribut,
        type: TypeArme,
        modif_eff: string,
        modif_fac: string,
        portee: string,
        degats: string,
        recharge: string,
        comp: string,
        modif_degats: Modificateur,
        mains: string,
        taille: LongueurArme,
        name: string,
        notes: string
    }

    type Weapon = {
        id: string,
        attr: Attribut,
        type: TypeArme,
        modif_eff: number,
        modif_fac: number,
        portee: number,
        degats: number,
        recharge: string,
        comp: string,
        modif_degats: Modificateur,
        mains: number,
        taille: LongueurArme,
        name: string,
        notes: string
    }

    type WeaponData = {
        type_arme_choice: TypeArme,
        nom_arme_input: string,
        attr_arme_choice: AttributEnum
        modif_eff_input: number,
        modif_fac_input: number,
        modif_degats_choice: "0" | Modificateur,
        longueur_arme_choice: LongueurArme,
        longueur_arme_input: string,
        competence_arme_choice: string,
        nb_mains_input: 1 | 2,
        portee_input: number,
        recharge_input: string,
        degats_input: number,
        notes_input: string,
        has_modificateur_degats: boolean,
        type_arme_int: 1 | 2 | 3 | 4,
        competence_arme_choice: string
    }

    type SequelleEntity = {
        min: string,
        max: string,
        short_description: string,
        description: string,
        effect: string,
    }

    type Sequelle = {
        min: number,
        max: number,
        short_description: string,
        description: string,
        effect: string,
        localisation?: string
    }
} 

export {}
