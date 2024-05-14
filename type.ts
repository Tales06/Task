/* eslint-disable quotes */
import { Animated } from "react-native";

/* eslint-disable eol-last */

/**
 * Interface for the Note object.
 * @interface
 * @property {number} id - The id of the note.
 * @property {string} note - The content of the note.
 * @property {boolean} isSelected - Whether the note is selected.
 * @property {Animated.Value} animDelete - The animated value for the delete action.
 * @property {number} isDone - The status of the note, 1 for done and 0 for not done.
 */

/**
 * In TypeScript, un'interfaccia è un modo potente per definire contratti all'interno del tuo codice e contratti con il codice al di fuori del tuo progetto.
 * Può essere utilizzata per definire la forma di un oggetto, funzione, classe, array, ecc.
 */
export interface Note{
    id: number;
    note: string;
    isSelected: boolean;
    animDelete: Animated.Value;
    isDone: number;
}