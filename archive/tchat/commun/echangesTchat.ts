import {
    FormatMessage, MessageParEnveloppe, Message,
    FormatConfigurationInitiale, ConfigurationParEnveloppe, Configuration,
    FormatErreurRedhibitoire, ErreurRedhibitoireParEnveloppe, ErreurRedhibitoire
} from "../../bibliotheque/reseau/formats";

import {
    SommetParEnveloppe, Sommet,
    NoeudMutableParEnveloppe, NoeudParEnveloppe,
    NoeudMutable, Noeud,
    FormatNoeud, FormatNoeudMutable, EtiquetteNoeud
} from "../../bibliotheque/reseau/noeuds";

import {
    creerEnJSONNoeudMutableSansVoisins
} from "../../bibliotheque/reseau/reseaux";

import {
    Unite, jamais
} from "../../bibliotheque/types/typesAtomiques";

import {
    FormatDateFr, dateEnveloppe, dateMaintenant,
} from "../../bibliotheque/types/date";

import {
    table,
} from "../../bibliotheque/types/table";

import {
    Identifiant, FormatIdentifiable
} from "../../bibliotheque/types/identifiant";
import { FormatTableIdentification } from "../../bibliotheque/types/tableIdentification";



/**
 * Port égal :
 * - soit à celui attribué par l'environnement Heroku,
 * - soit à 8081 en local.
 */
export const port: number = Number(process.env.PORT) || 8081;

/**
 * Format JSON pour un sommet du réseau de tchat.
 * Structure :
 * - ID : identifiant
 * - pseudo : nom
 */
export interface FormatSommetTchat extends FormatIdentifiable<'sommet'> {
    readonly pseudo: string,
}
/**
 * Etiquettes pour un sommet du réseau de tchat.
 */
export type EtiquetteSommetTchat = 'ID' | 'nom';

/**
 * Interface pour un sommet du réseau de tchat dérivée de Sommet et
 * l'étendant par des accesseurs en lecture.
 */
export interface SommetTchat
    extends Sommet<FormatSommetTchat, EtiquetteSommetTchat> {
    /**
     * Identifiant du sommet.
     */
    identifiant(): string;
    /**
     * Pseudo de l'utilisateur associé au sommet.
     */
    pseudo(): string;
}

/**
 * Sommet du réseau de tchat implémenté par une enveloppe.
 *
 */
export class SommetTchatParEnveloppe
    extends SommetParEnveloppe<FormatSommetTchat, FormatSommetTchat, EtiquetteSommetTchat>
    implements SommetTchat {

    /**
    * Constructeur à partir d'un sommet au format JSON.
    * @param etat sommet au format JSON
    */
    constructor(etat: FormatSommetTchat) {
        super((x) => x, etat);
    }
    /**
     * Représentation nette à partir des étiquettes "nom" et "ID".
     * @param e
     */
    net(e: EtiquetteSommetTchat): string {
        let s = this.val();
        switch (e) {
            case 'nom': return s.pseudo;
            case 'ID': return s.ID.val;
        }
        return jamais(e);
    }
    /**
     * Représentation sous la forme "nom (ID)".
     */
    representation(): string {
        return this.net('nom') + " (" + this.net('ID') + ")";
    }
    /**
     * Description au format JSON.
     */
    val(): FormatSommetTchat {
        return this.etat();
    }
    /**
     * Identifiant du sommet.
     */
    identifiant(): string {
        return this.etat().ID.val;
    }
    /**
     * Pseudo de l'utilisateur associé au sommet.
     */
    pseudo(): string {
        return this.etat().pseudo;
    }

}

/**
 * Fabrique d'un sommet.
 * @param s sommet au format JSON.
 */
export function sommetTchat(s: FormatSommetTchat) {
    return new SommetTchatParEnveloppe(s);
}

/**
 * Format JSON pour un noeud mutable du réseau de tchat.
 * Structure :
 * - mutable : etiquette
 * - ID : identifiant
 * - centre : un sommet
 * - voisins : une table mutable de sommetss
 */
export interface FormatNoeudTchatMutable
    extends FormatNoeudMutable<FormatSommetTchat> { }

/**
 * Interface définissant un noeud mutable d'un réseau de tchat.
 */
export interface NoeudTchatMutable extends NoeudMutable<FormatSommetTchat> { }

/**
 * Noeud mutable implémenté par une enveloppe.
 */
class NoeudTchatMutableParEnveloppe
    extends NoeudMutableParEnveloppe<FormatSommetTchat>
    implements NoeudTchatMutable {

    /**
     * Représentation nette du centre et des voisins.
     * - centre : nom (ID)
     * - voisins : { "ID" : "nom", etc. }
     * @param e une étiquette, "centre" ou "voisins"
     */
    net(e: EtiquetteNoeud): string {
        let s = this.val();
        switch (e) {
            case 'centre': return sommetTchat(s.centre).representation();
            case 'voisins':
                return table(s.voisins.identification).application((x) => x.pseudo).representation();
        }
        return jamais(e);
    }

}

/**
 * Fabrique un noeud mutable de réseau de tchat, à partir d'une description en JSON.
 * @param n description JSON du noeud
 */
export function creerNoeudTchatMutable(n: FormatNoeudTchatMutable): NoeudTchatMutable {
    return new NoeudTchatMutableParEnveloppe(n);
}

/**
 * Fabrique un noeud mutable à partir d'un sommet, sans voisins.
 * @param centre sommet au centre du noeud
 */
export function creerNoeudTchatSansVoisinsMutable(centre: FormatSommetTchat): NoeudTchatMutable {
    return new NoeudTchatMutableParEnveloppe(creerEnJSONNoeudMutableSansVoisins(centre));
}

/**
 * Format JSON pour un noeud du réseau de tchat.
 * Structure :
 * - ID : identifiant
 * - centre : un sommet
 * - voisins : une table de sommetss
 */
export interface FormatNoeudTchat
    extends FormatNoeud<FormatSommetTchat> { }

/**
 * Interface définissant un noeud d'un réseau de tchat.
 */
export interface NoeudTchat extends Noeud<FormatSommetTchat> { };

/**
 * Noeud implémenté par une enveloppe.
 */
class NoeudTchatParEnveloppe
    extends NoeudParEnveloppe<FormatSommetTchat>
    implements NoeudTchat {

    /**
     * Représentation nette du centre et des voisins.
     * - centre : nom (ID)
     * - voisins : { "ID" : "nom", etc. }
     * @param e une étiquette, "centre" ou "voisins"
     */
    net(e: EtiquetteNoeud): string {
        let s = this.val();
        switch (e) {
            case 'centre': return sommetTchat(s.centre).representation();
            case 'voisins':
                return table(s.voisins.identification).application((x) => x.pseudo).representation();
        }
        return jamais(e);
    }

}

/**
 * Fabrique d'un noeud de réseau de tchat, à partir d'une description en JSON.
 * @param n description JSON du noeud
 */
export function noeudTchat(n: FormatNoeudTchat): NoeudTchat {
    return new NoeudTchatParEnveloppe(n);
}

/**
 * Description JSON d'une configuration pour le tchat.
 * Structure :
 * - configurationInitiale : marqueur des configurations
 * - centre : sommet
 * - voisins : table de sommets voisins
 * - date : date en français
 */
export interface FormatConfigurationTchat extends FormatConfigurationInitiale {
    readonly "centre": FormatSommetTchat,
    readonly "voisins": FormatTableIdentification<'sommet', FormatSommetTchat>,
    readonly "date": FormatDateFr
}

/**
 * Etiquettes utiles pour représenter une configuration.
 */
export type EtiquetteConfigurationTchat = 'centre' | 'voisins' | 'date';

/**
 * Interface pour les configurations initiales du tchat.
 */
export interface ConfigurationTchat
    extends Configuration<FormatConfigurationTchat, EtiquetteConfigurationTchat> {
    /**
     * Noeud de tchat associé à la configuration.
     */
    noeud(): NoeudTchat;
};

/**
 * Configuration initiale d'un client du tchat implémentée
 * par une enveloppe.
 */
export class ConfigurationTchatParEnveloppe
    extends ConfigurationParEnveloppe<
    FormatConfigurationTchat,
    EtiquetteConfigurationTchat>
    implements ConfigurationTchat {

    /**
     * Représentation nette du centre et des voisins, ainsi que de la date.
     * - centre : nom (ID)
     * - voisins : {
     *     "ID": "nom",
     *     etc. }
     * - date : 12:53:53, le 02/02/2017 par exemple
     * @param e une étiquette, "centre" ou "voisins"
     */
    net(e: EtiquetteConfigurationTchat): string {
        let config = this.val();
        switch (e) {
            case 'centre': return sommetTchat(config.centre).representation();
            case 'voisins':
                return table(config.voisins.identification).application((x) => x.pseudo).representation();
            case 'date': return dateEnveloppe(config.date).representation();
        }
        return jamais(e);
    }

    /**
     * Représentation de la configuration sous la forme suivante :
     * - "(centre : nom (ID); voisins : { "ID" : "nom", etc. }) crée à heure, le date".
     */
    representation(): string {
        let cc = this.net('centre');
        let vc = this.net('voisins');
        let dc = this.net('date');
        return "(centre : " + cc + " ; voisins : " + vc + ") créée à " + dc;
    }
    /**
     * Noeud extrait de la structure JSON enveloppée.
     */
    noeud(): NoeudTchat {
        let centre: FormatSommetTchat = this.val().centre;
        let voisins = this.val().voisins;
        return noeudTchat({ "centre": centre, "voisins": voisins });
    }
}
/**
 * Fabrique d'une configuration initiale d'un client du tchat,
 * à partir de sa description en JSON.
 * @param c description de la configuration en JSON
 */
export function configurationTchat(c: FormatConfigurationTchat) {
    return new ConfigurationTchatParEnveloppe(c);
}

/**
 * Fabrique d'une configuration initiale d'un client du tchat,
 * à partir d'un noeud et d'une date, au format JSON.
 * @param n description du noeud au format JSON
 * @param date date en français au format JSON
 */
export function configurationDeNoeudTchat(
    n: FormatNoeudTchat, date: FormatDateFr)
    : ConfigurationTchatParEnveloppe {
    return new ConfigurationTchatParEnveloppe({
        "configurationInitiale": Unite.ZERO,
        "centre": n.centre,
        "voisins": n.voisins,
        "date": date
    });
}

/**
 * Description JSON d'une erreur pour le tchat.
 * Structure :
 * - erreurRedhibitoire : marqueur des erreurs
 * - messageErreurs : message d'erreur
 * - date : date en français
 */
export interface FormatErreurTchat extends FormatErreurRedhibitoire {
    readonly "messageErreur": string,
    readonly "date": FormatDateFr
}

/**
 * Etiquettes utiles pour représenter une erreur.
 */
export type EtiquetteErreurTchat = 'messageErreur' | 'date';

/**
 * Interfaces pour les erreurs du tchat.
 */
export interface ErreurTchat
    extends ErreurRedhibitoire<FormatErreurTchat, EtiquetteErreurTchat> {
};

/**
 * Erreur d'un client du tchat implémentée
 * par une enveloppe.
 */
export class ErreurTchatParEnveloppe
    extends ErreurRedhibitoireParEnveloppe<FormatErreurTchat, EtiquetteErreurTchat>
    implements ErreurTchat {
    /**
     * Représentation nette du message d'erreur, ainsi que de la date.
     * - messageErreur : texte
     * - date : 12:53:53, le 02/02/2017 par exemple
     * @param e une étiquette, "centre" ou "voisins"
     */
    net(e: EtiquetteErreurTchat): string {
        let erreur = this.val();
        switch (e) {
            case 'messageErreur': return erreur.messageErreur;
            case 'date': return dateEnveloppe(erreur.date).representation();
        }
        return jamais(e);
    }
    /**
     * Représentation de l'erreur sous la forme suivante :
     * - "[date : message d'erreur]".
     */
    representation(): string {
        return "[" + this.net('date') + " : " + this.net('messageErreur') + "]";
    }
}

/**
 * Fabrique d'une erreur d'un client du tchat,
 * à partir de sa description en JSON.
 * @param c description de l'erreur en JSON
 */
export function erreurTchat(err: FormatErreurTchat): ErreurTchatParEnveloppe {
    return new ErreurTchatParEnveloppe(err);
}

/**
 * Fabrique d'une erreur d'un client du tchat,
 * à partir d'un texte, le message d'erreur, et d'une date, au format JSON.
 * @param n texte du message d'erreur
 * @param date date en français au format JSON
 */
export function erreurTchatDeMessage(msg: string, date: FormatDateFr): ErreurTchatParEnveloppe {
    return new ErreurTchatParEnveloppe({
        "erreurRedhibitoire": Unite.ZERO,
        "messageErreur": msg,
        "date": date
    });
}




/**
 * Enumération des différents types de messages pour le tchat.
 */
export enum TypeMessageTchat {
    COM,
    TRANSIT,
    AR,
    ERREUR_CONNEXION,
    ERREUR_EMET,
    ERREUR_DEST,
    ERREUR_TYPE,
    INTERDICTION
}
/*
export function chaineTypeMessageChat(x : TypeMessageChat) : string  {
    return TypeMessageChat[x];
}
*/

/**
 * Description JSON d'un message pour le tchat.
 * Structure :
 * - ID : identifiant
 * - ID_emetteur : identifiant du sommet émetteur
 * - ID_destinataire : identifiant du sommet destinataire
 * - type : type du message
 * - date : date en français
 */
export interface FormatMessageTchat extends FormatMessage {
    readonly ID: Identifiant<'message'>,
    readonly ID_emetteur: Identifiant<'sommet'>,
    readonly ID_destinataire: Identifiant<'sommet'>,
    readonly type: TypeMessageTchat,
    readonly contenu: string,
    readonly date: FormatDateFr
}

/**
 * Etiquettes utiles pour représenter un message. TODO Ajouter ID.
 */
export type EtiquetteMessageTchat = 'type' | 'date' | 'ID_de' | 'ID_à' | 'contenu';

/**
 * Interface pour les messages de tchat.
 */
export interface MessageTchat extends Message<FormatMessageTchat, EtiquetteMessageTchat> {

    /**
     * Conversion du message en un message de transit (serveur vers destinataire).
     */
    transit(): MessageTchatParEnveloppe;

    /**
     * Conversion du message en un message accusant réception (serveur vers émetteur).
     */
    avecAccuseReception(): MessageTchatParEnveloppe;
}


/**
 * Message de tchat implémenté par une enveloppe.
 */
export class MessageTchatParEnveloppe
    extends MessageParEnveloppe<FormatMessageTchat, EtiquetteMessageTchat>
    implements MessageTchat {
    /**
     * Représentation nette :
     * - type : une constante de TypeMessageTchat
     * - date : représentation de la date ("heure, le date")
     * - ID_de : ID du sommet émétteur
     * - ID_à : ID du sommet destinataire
     * - contenu : le contenu du message
     * @param e étiquette
     */
    net(e: EtiquetteMessageTchat): string {
        let msg = this.val();
        switch (e) {
            case 'type': return TypeMessageTchat[msg.type];
            case 'date': return dateEnveloppe(msg.date).representation();
            case 'ID_de': return msg.ID_emetteur.val;
            case 'ID_à': return msg.ID_destinataire.val;
            case 'contenu': return msg.contenu;
        }
        return jamais(e);
    }
    /**
     * Représentation du message sous la forme suivante :
     * - "date, de ... à ... (type) - contenu".
     */
    representation(): string {
        let dem = this.net('ID_de');
        let am = this.net('ID_à');
        let typem = this.net('type');
        let datem = this.net('date');
        let cm = this.net('contenu');
        return datem + ", de " + dem + " à " + am + " (" + typem + ") - " + cm;
    }
    /**
     * Création d'un nouveau message, de même structure, sauf le type qui devient TRANSIT.
     */
    transit(): MessageTchatParEnveloppe {
        let msg = this.val();
        return new MessageTchatParEnveloppe({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_destinataire: msg.ID_destinataire,
            type: TypeMessageTchat.TRANSIT,
            contenu: msg.contenu,
            date: msg.date
        });
    }
    /**
     * Création d'un nouveau message, de même structure, sauf le type qui devient AR.
     */
    avecAccuseReception(): MessageTchatParEnveloppe {
        let msg = this.val();
        return new MessageTchatParEnveloppe({
            ID: msg.ID,
            ID_emetteur: msg.ID_emetteur,
            ID_destinataire: msg.ID_destinataire,
            type: TypeMessageTchat.AR,
            contenu: msg.contenu,
            date: msg.date
        });
    }

}

/**
 * Fabrique d'un message de tchat à partir de sa description en JSON.
 *
 * @param m description d'un mesage de tchat en JSON
 */
export function messageTchat(m: FormatMessageTchat) {
    return new MessageTchatParEnveloppe(m);
}

/**
 * Fabrique d'un message correspondnat à une erreur de connexion.
 * @param id identifiant du message
 * @param idEmetteur identifiant de l'émetteur
 * @param messageErreur message d'erreur
 */
export function messageErreurConnexion(id: Identifiant<'message'>,
    idEmetteur: Identifiant<'sommet'>, messageErreur: string): MessageTchat {
    return new MessageTchatParEnveloppe({
        ID: id,
        ID_emetteur: idEmetteur,
        ID_destinataire: idEmetteur,
        type: TypeMessageTchat.ERREUR_CONNEXION,
        contenu: messageErreur,
        date: dateMaintenant().val()
    });
}

/**
 * Fabrique d'un message de communication.
 * @param id identifiant du message
 * @param idEmetteur identifiant de l'émetteur
 * @param idDestinataire identifiant du destinataire
 * @param texte contenu
 * @param date date (en français)
 */
export function messageCommunication(id: Identifiant<'message'>,
    idEmetteur: Identifiant<'sommet'>, idDestinataire: Identifiant<'sommet'>,
    texte: string, date: FormatDateFr): MessageTchat {
    return new MessageTchatParEnveloppe({
        ID: id,
        ID_emetteur: idEmetteur,
        ID_destinataire: idDestinataire,
        type: TypeMessageTchat.COM,
        contenu: texte,
        date: date
    });
}

/**
 * Fabrique d'un message d'erreur retourné à l'émetteur, formé ainsi :
 * - ID: celui original,
 * - ID_emetteur: celui original,
 * - ID_destinataire: celui original,
 * - type: le type passé en argument,
 * - contenu: le message d'erreur passé en argument,
 * - date: celle originale.
 * @param original message original
 * @param codeErreur code de l'erreur
 * @param messageErreur message d'erreur
 */
export function messageRetourErreur(original: MessageTchat,
    codeErreur: TypeMessageTchat, messageErreur: string): MessageTchat {
    return new MessageTchatParEnveloppe({
        ID: original.val().ID,
        ID_emetteur: original.val().ID_emetteur,
        ID_destinataire: original.val().ID_destinataire,
        type: codeErreur,
        contenu: messageErreur,
        date: original.val().date
    });
}


