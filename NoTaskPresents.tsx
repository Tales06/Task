/* eslint-disable quotes */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/react-in-jsx-scope */
import { View, Image, StyleSheet, Text } from "react-native";

type NoTaskPresent = {
    isTheme: boolean
}

export default function NoTaskPresent({isTheme}: NoTaskPresent) {
    return (
        <View style={styles.container}>
            <Image source={require('./assets/images/noNotes.png')} style={{ width: 200, height: 200, tintColor: isTheme ? 'black' : 'white' }}  />
            <Text style={{fontSize: 18, color: isTheme ? 'black' : 'white', fontWeight: 'bold'}}>No Task Present. Create one by clicking on the plus button</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: '50%',
        alignItems: 'center',

    },
});
