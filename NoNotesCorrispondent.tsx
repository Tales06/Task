/* eslint-disable react-native/no-inline-styles */
/* eslint-disable quotes */
/* eslint-disable react/react-in-jsx-scope */
import { Text, View, StyleSheet, Image } from "react-native";


type NoTaskCorrispondentProps = {
    searchExist: boolean,
    isTheme: boolean
}
export default function NoNotesCorrispondent({searchExist, isTheme}: NoTaskCorrispondentProps) {
    if (!searchExist) {
        return (
            <View style={styles.container}>
                <Image source={require('./assets/images/noSearch.png')} style={{width: 200, height: 200}} />
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
