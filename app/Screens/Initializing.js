import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    AsyncStorage,
    Alert
} from "react-native";
import {goToAuth, goHome} from './navigation'

import { USER_KEY } from './config'
class Initializing extends Component {

    async componentDidMount() {
        try {
          const user = await AsyncStorage.getItem(USER_KEY)
          console.log('user: ', user)
          if (user) {
            goHome()
          } else {
            goToAuth()
          }
        } catch (err) {
          console.log('error: ', err)
          goToAuth()
        }
    }

    

    render() {
        return (
            <View style={styles.container}>
                <Text>Loading</Text>
            </View>
        );
    }
}
export default Initializing;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});