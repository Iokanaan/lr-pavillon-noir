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
        professions: ProfessionHolder[],
        posteBord: ProfessionHolder,
        commandement: Record<"capitaine" | "second" | "canonnier" | "quartier_maitre" | "maitre_equipage" | "maitre_canonnier", Computed<number>>
        attr: Record<AttributEnum, Signal<number>>
        modifiers: Record<Modificateur, Computed<number>>
        comp: Record<CompetenceEnum, CompSignals>,
        reputation: Record<"glo" | "inf", Computed<number>>,
        chance: Computed<number>,
        initiative: Computed<number>
    } & ExtendedSheet<CharData>

    type Competence = {
        id: CompetenceEnum,
        name: string,
        cc: boolean,
        metier: boolean,
    }

    type CompetenceEntity = {
        id: CompetenceEnum,
        name: string,
        cc: string,
        metier: string
    }

    type Attribut = {
        id: AttributEnum,
        name: string
    }
    
    type AttributEntity = {
        id: AttributEnum,
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
        attr_1: AttributEnum,
        attr_2: AttributEnum
    }

    type ProfessionHolder = {
        profession: Signal<Profession | undefined>,
        value: Computed<number | undefined>
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

    type Connaissances = {
        balistique: CompSignals
        cartographie: CompSignals
        commerce: CompSignals
        droit: CompSignals
        geographie: CompSignals
        histoire: CompSignals
        conn_specialisee: CompSignals[]
        herboristerie: CompSignals
        ingenierie_navale: CompSignals
        intendance: CompSignals
        lire_ecire: CompSignals
        medecine: CompSignals
        religion: CompSignals[]
        sciences: CompSignals
        tactique: CompSignals
    }

    type Artisanat = {
        art: CompSignals[]
        pointage_pieces: CompSignals
        recharge_pieces: CompSignals
        calfatage: CompSignals
        charpenterie: CompSignals
        voilerie: CompSignals
        cuisine: CompSignals
        artisanat: CompSignals[]
        chasse: CompSignals
        chirurgie: CompSignals
        dressage: CompSignals
        premiers_soins: CompSignals
    }

    type Maritimes = {
        connaissances_nautiques: CompSignals
        connaissances_navires: CompSignals
        connaissances_signalisation: CompSignals
        hydrographie: CompSignals
        navigation: CompSignals
        peche: CompSignals
        pratique_nautique: CompSignals
        timonerie: CompSignals
    }

    type Physiques = {
        acrobaties_escalade: CompSignals
        athletisme: CompSignals
        discretion: CompSignals
        equitation: CompSignals
        larcins: CompSignals
        natation: CompSignals
        survie: CompSignals
        vigilance: CompSignals
    }

    type Sociales = {
        comedie: CompSignals
        connaissances_colons_indigenes: CompSignals[]
        connaissances_marins: CompSignals[]
        empathie: CompSignals
        enseignement: CompSignals
        etiquette: CompSignals
        intidimidation: CompSignals
        jeu: CompSignals
        langue_etrangere: CompSignals[]
        meuneur_hommes: CompSignals
        persuasion: CompSignals
        politique: CompSignals
        seduction: CompSignals
    }

    type Combat = {
        arme_blanche: CompSignals[],
        mousquet: CompSignals,
        pistolet: CompSignals,
        grenate: CompSignals,
        arme_trait: CompSignals[],
        combat_mains_nues: CompSignals
        escrime: CompSignals,
        esquive: CompSignals
    }

    type CompetenceEnum = 
        "balistique" |
        "cartographie" |
        "commerce" |
        "droit" |
        "geographie" |
        "histoire" |
        "conn_specialisee_1" |
        "conn_specialisee_2" |
        "herboristerie" |
        "ingenierie_navale" |
        "intendance" |
        "lire_ecire" |
        "medecine" |
        "religion_1" |
        "religion_2" |
        "sciences" |
        "tactique" |
        "art_1" |
        "art_2" |
        "pointage_pieces" |
        "recharge_pieces" |
        "calfatage" |
        "charpenterie" |
        "voilerie" |
        "cuisine" |
        "artisanat_1" |
        "artisanat_2" |
        "chasse" |
        "chirurgie" |
        "dressage" |
        "premiers_soins" |
        "connaissances_nautiques" |
        "connaissances_navires" |
        "connaissances_signalisation" |
        "hydrographie" |
        "navigation" |
        "peche" |
        "pratique_nautique" |
        "timonerie" |
        "acrobaties_escalade" |
        "athletisme" |
        "discretion" |
        "equitation" |
        "larcins" |
        "natation" |
        "survie" |
        "vigilance" |
        "comedie" |
        "connaissances_colons_indigenes_1" |
        "connaissances_colons_indigenes_2" |
        "connaissances_colons_indigenes_3" |
        "connaissances_marins_1" |
        "connaissances_marins_2" |
        "connaissances_marins_3" |
        "empathie" |
        "enseignement" |
        "etiquette" |
        "intidimidation" |
        "jeu" |
        "langue_etrangere" |
        "meuneur_hommes" |
        "persuasion" |
        "politique" |
        "seduction" |
        "arme_blanche_1" |
        "arme_blanche_2" |
        "arme_blanche_3" |
        "arme_blanche_4" |
        "mousquet" |
        "pistolet" |
        "grenate" |
        "arme_trait_1" |
        "arme_trait_2" |
        "combat_mains_nues" |
        "escrime" |
        "esquive"


    type CompSignals = { 
        value: Signal<number>, 
        actualName?: Signal<string | undefined> 
    }
} 

export {}
