/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-native/no-inline-styles */


import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View, Animated, Button, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/AntDesign';
import { SafeAreaView, TextInput } from 'react-native';
// import { addNotes } from './db-services';
import { addNotes, getDBConnection, getTableNames } from './db-services';
import { SQLiteDatabase } from 'react-native-sqlite-storage';
import { createTables } from './db-services';
// import { getTableNames } from './db-services';
import { getNotes, getIsDone } from './db-services';
import { deleteTable } from './db-services';
import { ALERT_TYPE, Dialog, AlertNotificationRoot, Toast } from 'react-native-alert-notification';
import { Note } from './type';

// import { insertNote } from './myNote';

type ButtonNoteProps = {
    onNoteAdded: () => void;

}


export default function ButtonNote({ onNoteAdded}: ButtonNoteProps) {
    /**
    *@constant {boolean} isInputVisible - A state variable that indicates whether the input is visible. Initialized as false.
    * @function setInputVisible - Function to update the `isInputVisible` state.
    *
    * @constant {Animated.Value} animInput - A reference to an Animated.Value object initialized with -300.
    *
    * @constant {string} noteTitle - A state variable that holds the title of the note. Initialized as an empty string.
    * @function setNoteTitle - Function to update the `noteTitle` state.
     */
    const [isInputVisible, setInputVisible] = useState(false);
    const animInput = useRef(new Animated.Value(-300)).current;
    const [noteTitle, setNoteTitle] = React.useState('');


    /**
     *
     * @param text
     * @function handleInputChange - Function that updates the `noteTitle` state with the provided text.
     */
    const handleInputChange = (text: string) => {
        setNoteTitle(text);

    };

    /**
     * @function loadData - An async function wrapped in a useCallback hook that gets a database connection and creates tables.
     */
    const loadData = useCallback(async () => {
        try {
            const db = await getDBConnection();
            await createTables(db);
        } catch (err) {
            console.error(err);
        }
    }, []);


    /**
     * @function useEffect - React hook that is called when the component mounts. It calls the `loadData` function.
     */
    useEffect(() => {
        loadData();
    }, [loadData]);


    /**
     * @function addNote - An async function that validates the `noteTitle`, adds a note to the database, and updates the state.
     * @returns {Promise<void>} - A promise that resolves when the note is added.
     */
    const addNote = async () => {
        // console.log('Adding note');



            if (!noteTitle.trim()) {
                return Dialog.show({
                    type: ALERT_TYPE.WARNING,
                    title: 'Note empty',
                    textBody: 'Please insert a title',
                    button: 'OK',
                });
            } else {
                // console.log('Adding noteee');
                const db = await getDBConnection();
                await addNotes(db, noteTitle, false, new Animated.Value(1), 0);
                console.log('u');
                // await deleteTable(db, 'Notes');
                onNoteAdded(); // Richiama la callback dopo aver aggiunto la nota
                console.log('Note added');
                console.log(await getNotes(db));
                setInputVisible(false);
                setNoteTitle('');
                loadData();
            }

    };


    /**
     * @function notePressed - Function that toggles the visibility of the input and starts an animation.
     */
    const notePressed = () => {
        setInputVisible(!isInputVisible);
        Animated.timing(animInput, {
            toValue: animInput ? -50 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };






    // Utilizza la funzione openDB all'interno del tuo componente, ad esempio in useEffect


    return (
        <View style={styles.containerBTN}>
            <TouchableOpacity onPress={notePressed}>
                <Ionicons name="plus" size={55} color="white" />
            </TouchableOpacity>
            <Modal
                visible={isInputVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setInputVisible(false)}
            >
                <TouchableOpacity style={styles.modalContainerInput} onPress={() => {
                    setInputVisible(false);
                    Animated.timing(animInput, {
                        toValue: -300,
                        duration: 300,
                        useNativeDriver: false,
                    }).start();


                }}>
                    <Animated.View style={[styles.modalContentInput, { transform: [{ translateY: animInput }] }]}>
                        <SafeAreaView>
                            <Text style={{ fontFamily: 'Roboto', fontWeight: 'bold', fontSize: 20, position: 'relative', bottom: 5, color: 'black' }}>Title of task</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="   Insert a title of a task"
                                value={noteTitle}
                                placeholderTextColor={'black'}
                                cursorColor={'black'}
                                maxLength={15}


                                onChangeText={handleInputChange} />
                            <AlertNotificationRoot>

                                <View style={styles.buttonForm}>


                                    <Button title="Create a task"  onPress={addNote} />

                                </View>
                            </AlertNotificationRoot>

                        </SafeAreaView>
                    </Animated.View>

                </TouchableOpacity>
            </Modal>
        </View>
    );


}

const styles = StyleSheet.create({
    containerBTN: {
        height: 75,
        width: 75,
        backgroundColor: '#08C4FF',
        borderWidth: 3,
        borderColor: '#DDFFF9',
        position: 'absolute',
        right: 25,
        bottom: 25,
        elevation: 5,
        shadowColor: 'black',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 55,
        width: 200,
        borderWidth: 2,
        borderColor: 'black',
        borderRadius: 10,
        color: 'black',

    },
    modalContentInput: {
        height: 170,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
    modalContainerInput: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    buttonForm: {
        marginTop: 10,


    },

});
