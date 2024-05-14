/* eslint-disable semi */
/* eslint-disable quotes */
import { SQLiteDatabase, enablePromise, openDatabase } from "react-native-sqlite-storage";
import { Note } from "./type";
import { Animated } from "react-native";




/**
 * @description Promise
 * * A Promise is in one of these states:
 * - pending: initial state, neither fulfilled nor rejected.
 * - fulfilled: meaning that the operation completed successfully.
 * - rejected: meaning that the operation failed.
 * A pending promise can either be fulfilled with a value or rejected with a reason (error). When either of these options happens, the associated handlers queued up by a promise's then method are called.
 *
 * @typedef {Object} Promise
 * @property {<T>(value: T | PromiseLike<T>) => void} resolve - A function that, when called, fulfills the promise with the provided value.
 * @property {(reason?: any) => void} reject - A function that, when called, rejects the promise with the provided reason.
 * @property {<T>(onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>) => Promise<TResult1 | TResult2>} then - Appends fulfillment and rejection handlers to the promise, and returns a new promise resolving to the return value of the called handler.
 * @property {(onrejected?: (reason: any) => TResult | PromiseLike<TResult>) => Promise<TResult>} catch - Appends a rejection handler callback to the promise, and returns a new promise resolving to the return value of the callback if it is called, or to its original fulfillment value if the promise is instead fulfilled.
 */



/**
 * L'oggetto Promise rappresenta il completamento (o fallimento) di un'operazione asincrona e il suo valore risultante.
 * Una Promise è in uno di questi stati:
 * - pending: stato iniziale, né completato né rifiutato.
 * - fulfilled: significa che l'operazione è stata completata con successo.
 * - rejected: significa che l'operazione è fallita.
 * Una promessa in sospeso può essere adempiuta con un valore o rifiutata con una ragione (errore). Quando una di queste opzioni si verifica, i gestori associati messi in coda dal metodo then di una promessa vengono chiamati.
 *
 * @typedef {Object} Promise
 * @property {<T>(value: T | PromiseLike<T>) => void} resolve - Una funzione che, quando chiamata, adempie la promessa con il valore fornito.
 * @property {(reason?: any) => void} reject - Una funzione che, quando chiamata, rifiuta la promessa con la ragione fornita.
 * @property {<T>(onfulfilled?: (value: T) => TResult1 | PromiseLike<TResult1>, onrejected?: (reason: any) => TResult2 | PromiseLike<TResult2>) => Promise<TResult1 | TResult2>} then - Aggiunge gestori di adempimento e rifiuto alla promessa, e restituisce una nuova promessa che si risolve al valore di ritorno del gestore chiamato.
 * @property {(onrejected?: (reason: any) => TResult | PromiseLike<TResult>) => Promise<TResult>} catch - Aggiunge un gestore di rifiuto alla promessa, e restituisce una nuova promessa che si risolve al valore di ritorno del gestore se viene chiamato, o al suo valore di adempimento originale se la promessa viene invece adempiuta.
 */
//enablePromise consente l'utilizzo di async/await per gestire le operazione per il database in modo più efficente
enablePromise(true);

/**
 * Enables the use of async/await for more efficient database operations.
 * @returns {Promise<SQLiteDatabase>} A promise that resolves to an open database connection.
 */
export const getDBConnection = async () => {
   return openDatabase({ name: "todo-data.db", location: "default"} );
};


/**
 * questa funzione di nome createTables dato l'oggetto di tipo Sqlite che si chiama db crea una tabella dove data una query crea la tabella notes
 * @param db
 */

/**
 * Creates tables in the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @throws Will throw an error if the table creation fails.

 */
export const createTables = async (db: SQLiteDatabase) => {

   /**
    * rappresenta una query per creare una tabella di nome Notes. questa tabella creaa 2 colonne una id che è l'intero e una colonna note che è una stringa. Id svolge la funzione di chiave primaria per l'auto incremento
    * @param notesQuery
    *
    */
   const notesQuery = `
      CREATE TABLE IF NOT EXISTS Notes (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         note TEXT,
         isSelected INTEGER,
         animDelete REAL,
         isDone INTEGER
      )

   `;
   const queryTheme = "CREATE TABLE IF NOT EXISTS Theme (theme bit, id INTGER PRIMARY KEY)";
   try {
      await db.executeSql(notesQuery);
      await db.executeSql(queryTheme);
      console.log("Tables created");
      // console.log(await getIsDone(db));
      console.log(await getNotes(db));
   } catch (error) {
      console.error(error);
      throw Error(`Failed to create tables`);
   }
};

/**
 * questa funzione raprresenta un query che viene eseguita per ottenre i nomi delle tabelle presenti nel database
 * @param db
 * @returns
 */

/**
 * Retrieves the names of all tables in the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<string[]>} A promise that resolves to an array of table names.
 * @throws Will throw an error if the retrieval fails.
 */
export const getTableNames = async (db: SQLiteDatabase): Promise<string[]> => {
   try {
      const tableNames: string[] = [];
      /**
       * result rappresenta una query dove viene usata per selezionare i nomi delle tabelle sqlite_master dove c'è il tipo table
       */
      const results = await db.executeSql(
         "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );
      results?.forEach((result) => {
         for (let index = 0; index < result.rows.length; index++) {
            tableNames.push(result.rows.item(index).name);
         }
      });
      return tableNames;
   } catch (error) {
      console.error(error);
      throw Error("Failed to get table names from database");
   }
}


/**
 * questa funzione ti permette di aggiungere una nota al database in modo asincrono
 * @param db
 * @param note
 */



/**
 * Adds a note to the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @param {string} note - The note to add.
 * @param {boolean} isSelected - Whether the note is selected.
 * @param {Animated.Value} animDelete - The animation value for deletion.
 * @param {number} isDone - Whether the note is done.
 */
export const addNotes = async (db: SQLiteDatabase, note: string, isSelected: boolean, animDelete: Animated.Value, isDone: number) => {
   //addNoteQueryy è una query che ti permette di inserire un valore nella tabella note. Il VALUES (?) rappresenta la stringa che viene presa come parametro
   const addNoteQuery = `INSERT INTO Notes (note, isSelected, animDelete, isDone) VALUES (?, ?, ?, ?) `;

   try {
      await db.executeSql(addNoteQuery, [note, isSelected ? 1 : 0, animDelete.setValue(1), isDone]);
      console.log("Note added");
   } catch (error) {
      console.error(error);

   }
}


/**
 * questa funzione ti permette di acquisire dalla tabella il valore della colonna note
 * @param db
 * @returns
 */


/**
 * Retrieves all notes from the Notes table.
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<Note[]>} A promise that resolves to an array of notes.
 * @throws Will throw an error if the retrieval fails.
 */
export const getNotes = async (db: SQLiteDatabase): Promise<Note[]> => {
   //getNotesQuery rappresenta una query che ti permette di selezionare tutti i valori della colonna note
   const getNotesQuery = `SELECT id, note, isDone FROM Notes`;
   const notes: Note[] = [];
   const results = await db.executeSql(getNotesQuery);

   try {

      results?.forEach((result) => {
         for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            notes.push({
               id: row.id,
               note: row.note,
               isSelected: row.isSelected,
               animDelete: row.animDelete,
               isDone: row.isDone,
            });
         }
      });
      return notes;
   } catch (err) {
      console.error(err);
      throw Error("Failed to get notes from database"); // Optional: Throw an error if necessary
   }
}


/**
 * Retrieves all notes from the Notes table.
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<Note[]>} A promise that resolves to an array of notes.
 * @throws Will throw an error if the retrieval fails.
 */
export const deleteNote = async (db: SQLiteDatabase, id: number) => {
   const deleteNoteQuery = 'DELETE FROM Notes WHERE id = ?';
   try {
      await db.executeSql(deleteNoteQuery, [id]);
      console.log("Note deleted");
   } catch (error) {
      console.error(error);
   }

}


/**
 * Retrieves the 'isDone' status of all notes from the Notes table.
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<number[]>} A promise that resolves to an array of 'isDone' statuses.
 * @throws Will throw an error if the retrieval fails.
 */
export const getIsDone = async (db: SQLiteDatabase) => {
   const getIsDoneQuery = 'SELECT isDone FROM Notes';



   try {
      const results = await db.executeSql(getIsDoneQuery);
      const isDone: number[] = [];

      results?.forEach((result) => {
         for (let i = 0; i < result.rows.length; i++) {
            const row = result.rows.item(i);
            isDone.push(row.isDone);
         }
      });
      // console.log(isDone);
      return isDone;
   } catch (error) {
      console.error(error);
   }
}

/**
 * Updates the 'isDone' status of a note in the Notes table.
 * @param {SQLiteDatabase} db - The database connection.
 * @param {number} id - The id of the note to update.
 * @param {number} isDone - The new 'isDone' status.
 * @throws Will throw an error if the update fails.
 */
export const updateIsDone = async(db: SQLiteDatabase, id: number, isDone: number) => {
   const updateIsDoneQuery = `UPDATE Notes SET isDone = ? WHERE id = ${id}`;

   try {
      await db.executeSql(updateIsDoneQuery, [isDone]);
      console.log("Done updated");
   } catch (err) {
      console.error(err);
   }




}


/**
 * Deletes a table from the database.
 * @param {SQLiteDatabase} db - The database connection.
 * @param {string} tableName - The name of the table to delete.
 * @throws Will throw an error if the deletion fails.
 */
export const deleteTable = async (db: SQLiteDatabase, tableName: string) => {
   const deleteTableQuery = `DROP TABLE IF EXISTS ${tableName}`;

   try {
      await db.executeSql(deleteTableQuery);
      console.log("Table deleted");

   } catch (err) {
      console.error(err);
   }
}


/**
 * Updates a note in the Notes table.
 * @param {SQLiteDatabase} db - The database connection.
 * @param {number} id - The id of the note to update.
 * @param {string} note - The new note.
 * @param {boolean} isSelected - The new 'isSelected' status.
 * @throws Will throw an error if the update fails.
 */
export const updateNote = async (db: SQLiteDatabase, id: number, note: string): Promise<void>    => {
   const updateNoteQuery = "UPDATE Notes SET note = ? WHERE id = ?";
   try {
      await db.executeSql(updateNoteQuery, [note, id]);
      // console.log("Note updated");
   } catch (error) {
      console.error(error);
   }
};



/**
 * Searches for a note in the Notes table.
 * @param {SQLiteDatabase} db - The database connection.
 * @param {string} note - The note to search for.
 * @returns {Promise<{id: number, note: string, isDone: number}[]>} A promise that resolves to an array of notes.
 * @throws Will throw an error if the search fails.
 */
export const searchNote = async (db: SQLiteDatabase, note: string): Promise<{id: number, note: string, isDone: number} []> => {
   const searchNoteQuery = `SELECT * FROM Notes WHERE note LIKE '%${note}%'`;

   try {
      const notes: { id: number, note: string, isDone: number }[] = [];
      const results = await db.executeSql(searchNoteQuery);
      results?.forEach((result) => {
         for (let i = 0; i < result.rows.length; i++) {
            notes.push({
               id: result.rows.item(i).id,
               note: result.rows.item(i).note,
               isDone: result.rows.item(i).isDone,
            });
         }
      })
      return notes;
   } catch (err) {
      console.error(err);
   }

   return [];
}




/**
 * Changes the theme in the Theme table.
 * @param {SQLiteDatabase} db - The database connection.
 * @param {boolean} theme - The new theme.
 * @throws Will throw an error if the theme change fails.
 */
export const changeTheme = async (db: SQLiteDatabase, theme: boolean) => {
   const changeThemeQuery = 'INSERT OR REPLACE INTO Theme (id, theme) VALUES (1, ?)';

   try {
      await db.executeSql(changeThemeQuery, [theme ? 1 : 0]);
      console.log('Theme changed');
   } catch (error) {
      console.error(error);

   }
}



/**
 * Retrieves the current theme from the Theme table.
 * @param {SQLiteDatabase} db - The database connection.
 * @returns {Promise<boolean>} A promise that resolves to the current theme.
 * @throws Will throw an error if the retrieval fails.
 */
export const getTheme = async (db: SQLiteDatabase): Promise<boolean> => {
   const getThemeQuery = 'SELECT theme FROM Theme WHERE id = 1';

   try {
      const results = await db.executeSql(getThemeQuery);
      for (let i = 0; i < results[0].rows.length; i++) {
         const row = results[0].rows.item(i);
         return row.theme === 1;
      }
   } catch (err) {
      console.error(err);
   }
   return false
}

