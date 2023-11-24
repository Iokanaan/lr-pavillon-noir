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
    
    type Voie = {
        rangFoi: computed<string>,
        foi: Signal<number>
    }

    type NavireSheet = {
        entryStates: Record<string, Record<string, RepeaterState | undefined>>,
        mature: {
            artimon: Signal<boolean>,
            misaine: Signal<boolean>,
            mat: Signal<boolean>
        },
        armement: {
            armementByEntry: Signal<Record<string, ArtillerieData>>
        }
    }  & ExtendedSheet<NavireData>

    type EmplacementArtillerie = "bordee" | "chasse" | "fuite" | "muraille"
    type ZoneTirArtillerie = EmplacementArtillerie | "muraille_fuite" | "muraille_chasse"

    type ArtillerieData = {
        nom: string,
        nb_canons: number,
        calibre: string,
        mitraille: number,
        eff_canonnade: number,
        fac_canonnade: number,
        modif_recharge: number,
        tonnage: number,
        emplacement: EmplacementArtillerie,
        tir_chasse: boolean,
        tir_fuite: boolean,
        nb_hommes: number,
        portee_caronade: boolean
    }

    type PnjSheet = {
        entryStates: Record<string, Record<string, RepeaterState | undefined>>,
        selectedComp: Signal<CompetencePnj | undefined>,
        professions: ProfessionHolder[],
        posteBord: ProfessionHolder,
        attr: Record<AttributEnum, Signal<number>>
        modifiers: Record<Modificateur, Computed<number>>
        comp: Record<string, CompSignals>,
        religion: Signal<string>,
        titre: Signal<string | undefined>,
        reputation: Record<"glo" | "inf", { score: Signal<number>, level: Computed<number> }>,
        initiative: Computed<number>,
        taille: Signal<number | undefined>,
        poids: Signal<number | undefined>,
        age: Signal<number | undefined>,
        origine: Signal<{
            id: string | null,
            peuple: string,
            groupe: string,
            indAfr: boolean
        }>,
        origineSociale: Signal<string>,
        jeunesse: Signal<string>[],
        blessures: {
            localisation: Record<LocalisationShortEnum, {
                detail: Record<BlessureEnum, Signal<boolean>[]>,
                consolide: Computed<BlessureEnum>
            }>,
            general: { 
                etat: Computed<BlessureEnum>,
                malus: Computed<number>   
            }
        },
    }  & ExtendedSheet<PnjData>

    type PavillonSheet = {
        entryStates: Record<string, Record<string, RepeaterState | undefined>>,
        selectedComp: Signal<Competence | undefined>,
        professions: ProfessionHolder[],
        posteBord: ProfessionHolder,
        commandement: Record<"capitaine" | "second" | "canonnier" | "quartier_maitre" | "maitre_equipage" | "maitre_canonnier", Computed<number>>
        attr: Record<AttributEnum, Signal<number>>
        modifiers: Record<Modificateur, Computed<number>>
        comp: Record<CompetenceEnum, CompSignals>,
        religion: Signal<string>,
        titre: Signal<string | undefined>,
        reputation: Record<"glo" | "inf", { score: Signal<number>, level: Computed<number> }>,
        chance: Computed<number>,
        initiative: Computed<number>,
        taille: Signal<number | undefined>,
        poids: Signal<number | undefined>,
        age: Signal<number | undefined>,
        origine: Signal<{
            id: string | null,
            peuple: string,
            groupe: string,
            indAfr: boolean
        }>,
        origineSociale: Signal<string>,
        jeunesse: Signal<string>[],
        avantages: Signal<Record<string, Avantage>>,
        desavantages: Signal<Record<string, Avantage>>,
        blessures: {
            localisation: Record<LocalisationShortEnum, {
                detail: Record<BlessureEnum, Signal<boolean>[]>,
                consolide: Computed<BlessureEnum>
            }>,
            general: { 
                etat: Computed<BlessureEnum>,
                malus: Computed<number>   
            }
        },
        typeArcane: Signal<"communion" | "possession">,
        faveurs: Computed<number>,
        voies: Voie[],
        params: {
            excludeLongFeu: signal<boolean>
        }
    } & ExtendedSheet<CharData>

    type Competence = {
        id: CompetenceEnum,
        name: string,
        cc: boolean,
        metier: boolean,
        optional: boolean
        category: string
    }

    type CompetenceEntity = {
        id: CompetenceEnum,
        name: string,
        cc: string,
        metier: string,
        optional: string
    }

    type RiteData = {
        nom: string,
        description: string
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
        attr_1: AttributEnum,
        attr_2: AttributEnum,
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

    type OrigineSocialeEntity = {
        id: string,
        name: string
    }

    type OrigineSociale = {
        id: string,
        name: string
    }

    type PeupleEntity = {
        id: string,
        name: string,
        ind_afr: string
    }

    type Peuple = {
        id: string,
        name: string,
        ind_afr: boolean
    }

    type EscrimeEntity = {
        id: string,
        name: string,
        opportunites: string
    }

    type Escrime = {
        id: string,
        name: string,
        opportunites: number[]
    }

    type ManoeuvreEntity = {
        id: string,
        name: string,
    }

    type Manoeuvre = {
        id: string,
        name: string,
    }

    type EscrimeData = {
        nom: string,
        manoeuvres: string,
        off_1: boolean,
        off_2: boolean,
        off_3: boolean,
        off_4: boolean,
        off_5: boolean,
        off_6: boolean,
        off_7: boolean,
        off_8: boolean,
        off_9: boolean,
        off_10: boolean,
        predilection: boolean
    }

    type TypeArme = "cac" | "feu" | "jet" | "trait"
    type AttributEnum = "ADR" | "ADA" | "RES" | "FOR" | "ERU" | "PER" | "EXP" | "CHA" | "POU"
    type Modificateur = "MDFor" | "MDAdr"
    type LongueurArme = "courte" | "longue" | "tres_longue"

    type WeaponEntity = {
        id: string,
        attr: AttributEnum,
        type: TypeArme,
        modif_eff: string,
        modif_fac: string,
        portee: string,
        degats: string,
        recharge: string,
        comp: string,
        modif_degats: Modificateur,
        mains: "1" | "2",
        taille: LongueurArme,
        name: string,
        notes: string
    }

    type Weapon = {
        id: string,
        attr: AttributEnum,
        type: TypeArme,
        modif_eff: number,
        modif_fac: number,
        portee: number,
        degats: number,
        recharge: string,
        comp: string,
        modif_degats: Modificateur,
        mains: 1 | 2,
        taille: LongueurArme,
        name: string,
        notes: string
    }

    type CompPnjData = {
        comp: string,
        metier: boolean,
        degats: number,
        attaque: boolean,
        long_feu: boolean
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
        competence_arme_choice: CompetenceEnum,
        nb_mains_input: 1 | 2,
        portee_input: number,
        recharge_input: string,
        degats_input: number,
        notes_input: string,
        has_modificateur_degats: boolean,
        type_arme_int: 1 | 2 | 3 | 4,
        competence_arme_choice: string,
        long_feu: number
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

    type LocalisationEntity = {
        id: string,
        name: string,
        code: LocalisationEnum
    }

    type Localisation = {
        id: number,
        name: string,
        code: LocalisationEnum
    }

    type CompetencePnjEntity = {
        id: string,
        name: string,
        metier: string,
        category: string,
        attaque: string,
        feu: string
    }

    type CompetencePnj = {
        id: string,
        name: string,
        metier: boolean,
        category: string,
        attaque: boolean,
        feu: boolean
    }

    type TypeCompEntity = {
        id: string,
        name: string
    }

    type TypeComp = {
        id: string,
        name: string
    }

    type LocalisationEnum = "tete" | "bras_droit" | "bras_gauche" | "torse" | "jambe_droite" | "jambe_gauche"
    type BlessureEnum = "legere" | "serieuse" | "grave" | "critique" | "coma" | "mort" | "aucune"
    type LocalisationShortEnum = "tete" | "torse" | "bg" | "bd" | "jd" | "jg"
    
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
        "grenade" |
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
