/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/self-closing-comp */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable quotes */
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View, SafeAreaView, FlatList, TextInput, Button, Dimensions, Alert, Appearance, ScrollView} from "react-native";
import NavBar from "./NavBar";
import { Note } from "./type";
import ButtonNote from "./ButtonNote";
import { getDBConnection, getNotes, deleteNote, updateNote, createTables, deleteTable, getTheme, changeTheme, updateIsDone, getIsDone} from "./db-services";
import { useState, useEffect, useRef } from "react";
import LinearGradient from "react-native-linear-gradient";
import Ionicons from 'react-native-vector-icons/AntDesign';
import { ALERT_TYPE, AlertNotificationRoot, Dialog, Toast } from "react-native-alert-notification";
import { SQLiteDatabase } from "react-native-sqlite-storage";
import { width, height } from "./dimension";






export default function App() {


  /**
 * @description
 * This code is part of a React Native component written in TypeScript.
 *
 * @constant {Array<Note>} notes - A state variable that holds an array of Note objects. Initialized as an empty array.
 * @function setNotes - Function to update the `notes` state.
 *
 * @constant {boolean} isVisibleNoteUpdate - A state variable that indicates whether the note update is visible. Initialized as false.
 * @function setIsVisibleNoteUpdate - Function to update the `isVisibleNoteUpdate` state.
 *
 * @constant {Animated.Value} animationType - A reference to an Animated.Value object initialized with -300.
 *
 * @constant {number|null} editNoteId - A state variable that holds the ID of the note being edited. Initialized as null.
 * @function setEditNoteId - Function to update the `editNoteId` state.
 *
 * @constant {number} heightNuova - The height of the window.
 *
 * @constant {boolean} isTheme - A state variable that indicates whether the theme is applied. Initialized as false.
 * @function setIsTheme - Function to update the `isTheme` state.
 */
  const [notes, setNotes] = useState<Note[]>([]);
  const [isVisibleNoteUpdate, setIsVisibleNoteUpdate] = useState(false);
  const animationType = useRef(new Animated.Value(-300)).current;
  const [editNoteId, setEditNoteId] = useState<number | null>(null);
  const heightNuova = Dimensions.get('window').height;
  const [isTheme, setIsTheme] = useState(false);
  const [updateNotes, setUpdateNotes] = useState<Note[]>([]);


  /**
 * @description
 * This code is responsible for establishing a connection to the SQLite database.
 *
 * @constant {Promise<SQLiteDatabase>} db - A promise that resolves to an instance of SQLiteDatabase.
 * This promise is obtained by calling the `getDBConnection` function.
 *
 * @function getDBConnection - This function is expected to return a promise that resolves to an instance of SQLiteDatabase.
 *
 * Once the promise `db` is resolved, the `then` method is called with a callback function.
 * This callback function takes the resolved database instance as an argument and calls the `createTables` function with it.
 *
 * @function createTables - This function is expected to create tables in the provided SQLiteDatabase instance.
 */
  const db: Promise<SQLiteDatabase> = getDBConnection();
  db.then(database => createTables(database));


  useEffect(() => {
    /**
     * Initializes the theme by fetching it from the database and setting it as the current theme.
     *
     * @return {Promise<void>} Promise that resolves when the theme is successfully initialized.
     */
    const initTheme = async () => {
      const db = await getDBConnection();
      const theme = await getTheme(db);
      setIsTheme(theme);

    };
    initTheme();
    fetchNotes();
  }, []);



  const editIconPosition = {
    right: width * 0.02,
    top: height <= 755 ? height * 0.025 : height * 0.02,
  };


  /**
   * Asynchronously fetches notes from the database and sets them in the state.
   *
   *
   */
  async function fetchNotes() {
    try {
      const db = await getDBConnection();
      const note = await getNotes(db);
      setNotes(note);
    } catch (error) {
      console.error(error);
    }

  }


  /**
   * A function that asynchronously sets a note as done based on the provided ID and status.
   *
   * @param {number} id - The ID of the note to be marked as done
   * @param {number} isDone - The status of the note (0 for not done, 1 for done)
   *
   */
  const setDone = async (id: number, isDone: number) => {
    if (isDone === 0){

      try {

        const updateIsDones = isDone ? 0 : 1;

        const updateNotes = notes.map((note) => {
          if (note.id === id) {
            return { ...note, isDone: updateIsDones};
          }
          return note;
        });

        setNotes(updateNotes);
        // console.log('a')
        const db = await getDBConnection();
        await updateIsDone(db, id, updateIsDones);
        console.log(await getIsDone(db));
        if (updateIsDones) {

          return Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'Success',
            textBody: 'Task marked as done',
            button: 'OK',



          });
        }
      } catch (error) {
        console.error(error);
      }
    } else {
      return;
    }
  };







  /**
   * A function that handles the input change by updating the notes based on the provided text, ID, and selection status.
   *
   * @param {string} text - The text content of the note
   * @param {number} id - The ID of the note to be updated
   * @param {boolean} isSelected - The selection status of the note
   *
   */
  const handleInputChange = async (text: string, id: number) => {

    const updateInputNote = notes.map((note) => {
      if (note.id === id) {
        return { ...note, note: text };
      }
      return note;
    });

    setNotes(updateInputNote);
    try {

      const db = await getDBConnection();
      await updateNote(db, id, text);
    } catch (error) {
      console.error(error);
    }
  };





  /**
   * A function that handles the addition of a note.
   *
   *
   */
  const handleNoteAdded = () => {
    fetchNotes();

  };

  /**
   * Handles the deletion of a note from the database.
   *
   * @param {number} id - The ID of the note to be deleted
   *
   */
  const handleDeleteNote = async (id: number) => {
    try {
      const db = await getDBConnection();
      await deleteNote(db, id);
      fetchNotes();
    } catch (error) {
      console.error(error);
    }
  };


  /**
   * Toggles the theme between light and dark mode.
   *
   * @return {Promise<void>} Promise that resolves when the theme is successfully toggled.
   */
  const toggleTheme = async () => {
    try {
      const db = await getDBConnection();
      await changeTheme(db, !isTheme);
      setIsTheme(prevTheme => !prevTheme);
    } catch (err) {
      console.error(err);
    }
  };






  /**
   * Updates the state to trigger an edit action for a specific note.
   *
   * @param {number} id - The ID of the note to be edited
   */
  const editPressed = (id: number) => {
    setEditNoteId(id);
    setIsVisibleNoteUpdate(!isVisibleNoteUpdate);
    setIsVisibleNoteUpdate(true);
    Animated.timing(animationType, {
      toValue: animationType ? -50 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };


  /**
   * A function that updates the input note based on the provided text, ID, and selection status.
   *
   * @param {string} text - The text content of the note
   * @param {number} id - The ID of the note to be updated
   *
   *
   */
  const updateInputNote = async (text: string, id: number) => {
    if (!text.trim()) {
      return Dialog.show({
        type: ALERT_TYPE.WARNING,
        title: 'Note empty',
        textBody: 'Please insert a title for update your note',
        button: 'Ok',
      });
    } else {
      try {

        const db = getDBConnection();
        await updateNote(await db, id, text);
        console.log('Note updated');
        console.log(await getNotes(await db));
        setIsVisibleNoteUpdate(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  /**
 * Update the state of notes in the App component
 *
 * @param {number} id - The ID of the note
 * @param {number} isDone - The status of the note
 * @return {void} No return value
 */
  const handleNoteMarkedAsDone = (id: number, isDone: number) => {
    // Aggiorna lo stato delle note nel componente App
    const updatedNotes = notes.map((note) => {
        if (note.id === id) {
            return { ...note, isDone: isDone };
        }
        return note;
    });
    setNotes(updatedNotes);
  };





  return (

    <View style={isTheme ? styles.containerWhite : styles.containerDark}>

      <View>
          <FlatList
            style={styles.noteContainer}
            data={notes}
            renderItem={({ item }) => (

              <LinearGradient colors={item.isDone ? ['#a8ff78', '#78ffd6'] : ['#a74cf2', '#8c56ef', '#715de9', '#5561e1', '#3963d7']} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >

                <AlertNotificationRoot>
                  <Text style={styles.note} onPress={() => setDone(item.id, item.isDone)}>{item.note}</Text>
                </AlertNotificationRoot>
                  <Ionicons name="edit" size={width * 0.08} color="white" style={[styles.editIcon, editIconPosition]} onPress={() => editPressed(item.id)}></Ionicons>
                  <Modal
                    visible={isVisibleNoteUpdate && editNoteId === item.id}
                    transparent={true}
                    animationType="slide"
                    onRequestClose={() => { setIsVisibleNoteUpdate(false); setEditNoteId(null); }}>

                    <TouchableOpacity style={styles.modalUpdateNote} onPress={() => {
                      setIsVisibleNoteUpdate(false);
                      Animated.timing(animationType, {
                        toValue: -300,
                        duration: 300,
                        useNativeDriver: false,
                      }).start();
                    }}>

                      <Animated.View style={[styles.modalContentUpdateNote, { transform: [{ translateY: animationType }] }]}>
                          <Text style={{ fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 20, position: 'relative', bottom: 5, color: 'black' }}>Update your task</Text>
                          <TextInput
                            style={styles.input}
                            placeholder="  Update your task"
                            value={item.note}
                            maxLength={15}
                            onChangeText={(text) => handleInputChange(text, item.id)}
                            />


                          <AlertNotificationRoot>
                            <View style={styles.buttonForm}>

                              <Button title="Update task" onPress={() => updateInputNote(item.note, item.id)} />
                            </View>
                          </AlertNotificationRoot>
                      </Animated.View>
                    </TouchableOpacity>
                  </Modal>
                  <TouchableOpacity>


                      <Ionicons name="delete" size={30} color="white" style={{ position: 'absolute', right: 50, bottom: heightNuova <= 755 ? heightNuova * 0.01 : heightNuova * 0.015}} onPress={() => handleDeleteNote(item.id)} />

                  </TouchableOpacity>
                </LinearGradient>
            )}
        keyExtractor={(item, index) => index.toString()} />


        <NavBar isTheme={isTheme} toggleTheme={toggleTheme} onTaskMarkedAsDone={handleNoteMarkedAsDone}/>
        </View>






      <ButtonNote onNoteAdded={handleNoteAdded} />

    </View>
  );
}

const styles = StyleSheet.create({
  containerDark: {
    flex: 1,
    backgroundColor: "#363636",
    // alignItems: "center",
    // justifyContent: "center",
  },



  containerWhite: {
    flex: 1,
    backgroundColor: "white",
  },



  note: {

    fontSize: 25,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 12,
    textAlignVertical: 'center',

    color: 'white',
  },
  noteContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: -10,
    paddingHorizontal: width * 0.05,
    marginTop: height * 0.1,
  },

  gradient: {

    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: height * 0.012,
    borderWidth: 3,
    borderColor: '#DDFFF9',

    borderRadius: 15,
    marginVertical: 10,
    elevation: 2,
    shadowOpacity: 0.5,
    width: width * 0.9,
    height: height * 0.093,


    textAlignVertical: 'center',
    color: 'white',
  },

  modalUpdateNote: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },

  modalContentUpdateNote: {
    height: 170,
    padding: 20,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  input: {
    height: 55,
    width: 200,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    color: 'black',
  },

  buttonForm: {

    marginTop: 10,
  },


  modalContentNote: {
    display: 'flex',
  },

  noteLineThrough: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 10,
    paddingVertical: 15,
    textAlignVertical: 'center',
    textDecorationLine: "line-through",
    color: 'white',
  },

  editIcon: {
    position: 'absolute',

  },
});


