import React from 'react'
import { StyleSheet, Button, View, Image,AsyncStorage,TouchableOpacity,TouchableWithoutFeedback,NetInfo,FlatList,SafeAreaView} from 'react-native'
import email from 'react-native-email'
import { Container, Content, Card, Text } from 'native-base'
import nbStyles from './Style'
import ListNotification from '@Component/Notification/ListNotification'
import SwipeableList from '@Component/SwipeableList/SwipeableList'
import {Navigation} from 'react-native-navigation'
import OfflineNotice from '@Component/OfflineNotice';
import moment from 'moment'
import Icon from 'react-native-vector-icons/FontAwesome5';
import Swipeout from 'react-native-swipeout';
import { SwipeListView } from 'react-native-swipe-list-view';
import ListView from '@Component/ListView/ListView';

export default class Inbox extends React.Component {

    static options(passProps) {
        return {
            topBar : {
                noBorder:true,
                visible : false,
                height : 0
            }
        }
    }

    constructor(props){
        super(props)
        this.state = {
            activeRow : null,

            email : '',
            dataNotification : [],
            badge : '',

            isReaded : 1
        }
        console.log(props.scroll)
        Navigation.events().bindComponent(this);

    }

    async componentWillMount(){
        const datas =  {
            email : await AsyncStorage.getItem("@User"),
            
        }

        this.setState({
            email : datas.email
        },()=>{
            this.getNotification()
        })
        // this.getBadge(datas)

        // this.setState({
        //     time: new Date(),
        //     timer: 
        // })

        //RealTime
        // setInterval(() => {
        //     this.getBadge(datas) 
        // }, 1000)

        //Tidak RealTime
        this.getBadge(datas) 

    }

    

    getNotification = () => {
        const formData = {
            email : this.state.email
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_notification/getNotification/IFCAMOBILE',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            this.setState({dataOvertime:[]})
            if(res.Error === false){
                let resData = res.Data;
                this.setState({dataNotification : resData})
                console.log(res)
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    getBadge = async(data) =>{
        const formData = {
            email : data.email
        }

        await fetch('http://35.198.219.220:2121/alfaAPI/c_notification/getNotificationBadge/IFCAMOBILE',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            this.setBadge(res.Data[0].cnt.toString())

        }).catch((error) => {
            console.log(error);
        });
    }

    setBadge = (data) =>{
        
        Navigation.mergeOptions(this.props.componentId, {
            bottomTab: {
              badge: data
            }
        });
    }

    onRefresh =()=>{
        this.setState({dataNotification:[]},()=>{this.getNotification()})
    }

    renderItem = ({item,index})=>{
        return(
            <ListNotification item={item} index={index} />
        )
        
    }
    
    render() {
        return (
            <Container>
                <SafeAreaView>
                    <OfflineNotice/>
                    <View style={nbStyles.wrap}>
                        <View style={nbStyles.subWrap}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={nbStyles.title}>Notifications</Text>
                                <View style={{flexDirection:'row',justifyContent:'space-evenly',alignItems:'center'}}>
                                </View>
                            </View>
                        </View>
                    </View>
                </SafeAreaView>
                {this.state.dataNotification.length == 0 ?
                <View style={{justifyContent:'center',alignItems:'center'}}>
                    <Text>Data Empty</Text> 
                </View>:
                <ListView data={this.state.dataNotification} />
                }
            </Container>

        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5
    },
    Button: {
        backgroundColor: '#f5f5f5'

    }
})