/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable comma-dangle */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
import React, { useEffect, useRef, useState} from "react";
import { StyleSheet, Text, TouchableOpacity, View, Modal, Animated, TextInput, FlatList, Keyboard} from 'react-native';
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { getDBConnection, searchNote, updateIsDone} from "./db-services";
import { Note } from "./type";
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from "react-native-linear-gradient";
import NoNotesCorrispondent from "./NoNotesCorrispondent";
import { width, height } from "./dimension";
// import { getDBConnection, searchNote } from "./db-services";

/**
 * @typedef NavBarProps
 *
 * @property {Function} toggleTheme - A function that toggles the theme.
 *
 * @property {boolean} isTheme - A boolean that indicates whether the theme is applied.
 *
 * @property {Function} onTaskMarkedAsDone - A function that is called when a task is marked as done.
 * It takes the ID of the task and a number indicating whether the task is done as arguments.
 */
export type NavBarProps = {
    toggleTheme: () => void,
    isTheme: boolean,
    onTaskMarkedAsDone: (id: number, isDone: number) => void,

}

export default function NavBar({ toggleTheme, isTheme, onTaskMarkedAsDone }: NavBarProps) {

    /**
     * @description
     * This code is part of a React Native component written in TypeScript.
     *
     * @constant {boolean} isMenuVisible - A state variable that indicates whether the menu is visible. Initialized as false.
     * @function setIsMenuVisible - Function to update the `isMenuVisible` state.
     *
     * @constant {boolean} isSearchVisible - A state variable that indicates whether the search is visible. Initialized as false.
     * @function setIsSearchVisible - Function to update the `isSearchVisible` state.
     *
     * @constant {string} searchNoteValue - A state variable that holds the value of the search note. Initialized as an empty string.
     * @function setSearchNoteValue - Function to update the `searchNoteValue` state.
     *
     * @constant {Array<Note>} searchResult - A state variable that holds the search results. Initialized as an empty array.
     * @function setSearchResult - Function to update the `searchResult` state.
     *
     * @constant {boolean} searchResultExist - A state variable that indicates whether the search result exists. Initialized as true.
     * @function setSearchResultExist - Function to update the `searchResultExist` state.
     *
     * @constant {Animated.Value} slideAnim - A reference to an Animated.Value object initialized with -300.
    **/
    const [isMenuVisible, setIsMenuVisible] = useState(false);
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchNoteValue, setSearchNoteValue] = useState('');
    // const [searchNoteValue, setSearchNoteValue] = useState('');
    const [searchResult, setSearchResult] = useState<Note[]>([]);
    const [searchResultExist, setSearchResultExist] = useState(true);

    const slideAnim = useRef(new Animated.Value(-300)).current;
    // const slideAnim2 = useRef(new Animated.Value(0)).current;




    // const db :Promise<SQLiteDatabase> = getDBConnection();

    /**
     * @function useEffect - React hook that is called when `searchNoteValue` changes. It calls the `handleSearch` function.
     */
    useEffect(() => {
        handleSearch();
    }, [searchNoteValue]);

    /**
     * @function theme - React hook that is called when `toggleTheme` changes. It calls the `theme` function.
     */
    const theme = async () => {
        await toggleTheme();
    };

    /**
     * @function useEffect - React hook that is called when the component mounts. It adds a listener to the keyboard hide event and removes it when the component unmounts.
     */
    useEffect(() => {
        const hideKeyBoard = () => {
            Keyboard.dismiss();
        };

        if (!isSearchVisible) {
            hideKeyBoard();
        }

        Keyboard.addListener('keyboardDidHide', hideKeyBoard);

        return () => {
            Keyboard.removeAllListeners('keyboardDidHide');
        };

    });


    /**
     * @function menuPressed - Function that toggles the visibility of the menu and starts an animation.
     */
    const menuPressed = () => {
        setIsMenuVisible(!isMenuVisible);
        Animated.timing(slideAnim, {
            toValue: isMenuVisible ? -300 : 0,
            duration: 300,
            useNativeDriver: false,
        }).start();
    };


    /**
     *
     * @param text
     * @function changeText - Function that updates the `searchNoteValue` state with the provided text.
     */
    const changeText = (text: string) => {
        setSearchNoteValue(text);
    };

    /**
     *
     * @function handleSearch - An async function that searches for notes and updates the `searchResult` and `searchResultExist` states.
     */
    const handleSearch = async () => {
        try {
            if (searchNoteValue.trim() !== '') {
                const db = await getDBConnection();
                const notes = await searchNote(db, searchNoteValue);
                const searchNotes: Note[] = notes.map(result => ({
                    id: result.id,
                    note: result.note,
                    isSelected: false,
                    animDelete: new Animated.Value(1),
                    isDone: result.isDone

                }));
                setSearchResult(searchNotes);
                setSearchResultExist(searchNotes.length > 0);
            } else {
                setSearchResult([]);
                setSearchResultExist(true);
                // setSearchNoteValue('');
            }


        } catch (error) {
            console.error(error);
        }
        return [];
    };

    /**
     *
     * @param id
     * @param isDone
     * @function setDone - An async function that updates the `isDone` property of a note and calls the `onTaskMarkedAsDone` function.
     */
    const setDone = async (id: number, isDone: number) => {
        try {
            const searchResultTask = searchResult.map((note) => {
                if (note.id === id) {
                    return { ...note, isDone: isDone ? 1 : 1 };
                }
                return note;
            });

            setSearchResult(searchResultTask);


            onTaskMarkedAsDone(id, isDone);

            const db = await getDBConnection();
            await updateIsDone(db, id, isDone);

        } catch (error) {
            console.error(error);
        }
    };

    return (
        <SafeAreaView style={styles.container}>

        <View style={styles.containerNav}>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', top: 5}}>
                <TouchableOpacity onPress={menuPressed}>
                    <IonIcons name="account-circle-outline" size={50} color={isTheme ? "black" : "white"} />
                </TouchableOpacity>
                <SafeAreaView>

                        <TextInput
                            style={styles.inputSearch}
                            placeholder="    ...Search"
                            placeholderTextColor={isTheme ? "black" : "white"}
                            onPressIn={() => setIsSearchVisible(true)}



                        />

                    <Modal
                        visible={isSearchVisible}
                        animationType="slide"
                        transparent={true}
                        onRequestClose={() => setIsSearchVisible(false)}
                    >
                        <View style={isTheme ? styles.modalSearchWhite : styles.modalSearchBlack}>
                            <IonIcons name="keyboard-backspace" style={styles.icon} size={50} onPress={() => setIsSearchVisible(false)} />

                            <TextInput
                                style={[styles.inputSearchModal, { color: isTheme ? "black" : "white" }]}
                                placeholder="    ...Search"
                                placeholderTextColor={isTheme ? "black" : "white"}
                                value={searchNoteValue}
                                cursorColor={isTheme ? "black" : "white"}
                                onChangeText={(text) => { changeText(text); }}



                            />

                            <FlatList
                                style={styles.noteSearchContainer}
                                data={searchResult}
                                numColumns={2}
                                renderItem={({item}) => (
                                    <View style={styles.noteSearch}>
                                        <LinearGradient colors={item.isDone ? ['#a8ff78', '#78ffd6'] : ['#a74cf2', '#8c56ef', '#715de9', '#5561e1', '#3963d7']} style={styles.gradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} >

                                            <Text style={styles.note} onPress={() => setDone(item.id, 1)}>{item.note}</Text>
                                        </LinearGradient>

                                    </View>
                                )}

                            />
                            {!searchResultExist && (
                               <NoNotesCorrispondent searchExist={searchResultExist} isTheme={isTheme}/>
                            )}

                        </View>
                    </Modal>
                </SafeAreaView>


            </View>

            <Modal
                visible={isMenuVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setIsMenuVisible(false)}
            >
                <TouchableOpacity style={styles.modalContainer} onPress={() => {
                    setIsMenuVisible(false);
                    Animated.timing(slideAnim, {
                        toValue: -300,
                        duration: 300,
                        useNativeDriver: false,
                    }).start();
                }}
                >
                    <Animated.View style={[styles.modalContent, {transform: [{translateX: slideAnim}]}]}>
                        <View style={styles.menuContainer}>

                            <IonIcons name="account-circle-outline" size={50} color="black" />
                            <Text style={styles.text}>Hello User</Text>

                            <IonIcons name="theme-light-dark" size={50} color="black" onPress={theme} />
                            <Text style={styles.text}>Change theme</Text>

                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </Modal>
        </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Bar: {
    //     width:400,
    //     height: 60,
    //     backgroundColor: '#7ADFBB',
    //     borderRadius: 30,
    //     position: 'absolute',
    //     top: 15,
    //     left: 5,
    // },

    container: {
        position: 'absolute',
        top: 15,
        left: 10,
        width: width * 0.95, // Utilizza il 90% della larghezza dello schermo
        height: 60,
        shadowColor: 'rgba(0, 0, 0, 0.5)',
        elevation: 5,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',




    },

    containerNav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        rowGap: 5,
        paddingHorizontal: width * 0.04, // Utilizza il 5% della larghezza dello schermo come spazio laterale
        marginTop: height * 0.001, // Utilizza il 2% dell'altezza dello schermo come margine superiore
    },

    menu: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: 60,
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        width: 300,
        height: 200,
        flexDirection: 'column',

    },
    menuItem: {

        alignItems: 'center',
        padding: 10,
        color: 'black',
        fontSize: 20
    },

    inputSearch: {
        width: 340,
        height: 45,
        fontSize: 20,
        color: 'black',



    },
    inputSearchModal: {
        width: 410,
        height: 70,

        fontSize: 20,
        borderRadius: 15,
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },

    modalSearchBlack: {
        flex: 1,
        width: 450,
        height: 200,
        flexWrap: 'wrap',
        gap: 10,
        borderColor: '#DDFFF9',
        backgroundColor: '#363636',

    },


    modalSearchWhite: {
        flex: 1,
        width: 450,
        height: 200,
        flexWrap: 'wrap',
        gap: 10,
        borderColor: 'white',
        backgroundColor: 'white',
    },



    note: {
        // fontSize: 30,
        // fontWeight: "bold",
        // paddingHorizontal: 10,
        // paddingVertical: 5,
        // color: 'black',
        // height: 70,
        // width: 400,
        // borderWidth: 2,
        // borderColor: '#DDFFF9',
        // borderRadius: 15,

        fontSize: 30,
        fontWeight: "bold",
        paddingHorizontal: 10,
        paddingVertical: 10,

    },
    icon: {
        color: 'black'
    },

    noteSearchContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        rowGap: -90,

    },
    gradient: {
        fontSize: 20,
        fontWeight: "bold",
        borderWidth: 3,
        borderColor: '#DDFFF9',
        borderRadius: 15,
        marginVertical: 10,
        elevation: 2,
        shadowOpacity: 0.5,
        width: 190,
        height: 70,
        textAlignVertical: 'center',
        color: 'white',
    },
    noteSearch: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        marginHorizontal: 9, // Aggiungi spazio tra le colonne
        marginBottom: 10, // Aggiungi spazio sotto le righe
        width: '50%', // Occupa metà dello spazio del container padre



    },
    menuContainer: {
        flex: 1,
        flexDirection: 'column',
        gap: 15,

    },
    text: {
        fontSize: 20,
        fontWeight: "bold",
        paddingHorizontal: 10,
        color: 'black',
        left: 50,
        bottom: 50,
    }



});

