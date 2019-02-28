import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    FlatList,
    Alert
} from "react-native";
import ListNotification from '@Component/Notification/ListNotification'


class ListView extends Component {
    constructor(props){
        super(props)
        this.state = {
            data : props.data,
            scrollEnabled : true
        }
        this.delete = this.delete.bind(this);
        this.readNotification = this.readNotification.bind(this);
        this.showAlert = this.showAlert.bind(this);

    }


    delete(key) {
        const data = this.state.data.filter(item => item.NotificationID !== key);
        this.setState({data},()=>{
            this.deleteNotification(key)
        });
    }

    readNotification = async(data) =>{
        const formData = {
            notificationId : data
        }

        await fetch('http://35.198.219.220:2121/alfaAPI/c_notification/readNotification/IFCAMOBILE',{
            method : "POST",
            body :JSON.stringify(formData)
        }).catch((error) => {
            console.log(error);
        });
    }

    deleteNotification = async(data) =>{
        const formData = {
            notificationId : data
        }

        await fetch('http://35.198.219.220:2121/alfaAPI/c_notification/deleteNotification/IFCAMOBILE',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .catch((error) => {
            console.log(error);
        });
    }

    showAlert(data) {
        Alert.alert(
        'Notification', data.Remarks,
        [
            { text: 'Cancel', onPress: () => console.log('UserCanceled') },
            { text: 'Delete', onPress: () => this.delete(data.NotificationID) },
        ],
        { cancelable: false },
        );
    }

    setScrollEnabled(enable) {
        this.setState({
          scrollEnabled:enable,
        });
      }

    renderItem = ({item,index})=>{
        return(
            <ListNotification item={item} index={index} onLongPress={this.showAlert} onPress={this.readNotification} />
        )
    }

    render() {
        return (
            <View style={{ justifyContent:'center',flex:1,backgroundColor:'transparent'}}>
                <FlatList
                data={this.state.data}
                renderItem={(item,index)=>this.renderItem(item,index)}
                keyExtractor={(item,index)=>item.NotificationID.toString()}
                scrollEnabled={this.state.scrollEnabled}
                />
            </View>
        );
    }
}
export default ListView;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});