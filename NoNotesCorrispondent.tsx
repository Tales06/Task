/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable react/react-in-jsx-scope */
import { Text, View, StyleSheet } from "react-native";
import IonIcons from 'react-native-vector-icons/MaterialCommunityIcons';

type NoTaskCorrispondentProps = {
    searchExist: boolean,
    isTheme: boolean
}
export default function NoNotesCorrispondent({searchExist, isTheme}: NoTaskCorrispondentProps) {
    if (!searchExist) {
        return (
            <View style={styles.container}>
                <IonIcons name="note-search-outline" size={100} color={isTheme ? 'black' : 'white'} />
                <Text style={{ color: isTheme ? 'black' : 'white', fontSize: 20, fontWeight: 'bold'}}>No matching tasks</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
