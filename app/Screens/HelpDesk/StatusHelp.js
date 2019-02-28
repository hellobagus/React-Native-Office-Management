import React, { Component } from 'react';
import { View, StyleSheet, Image, AsyncStorage,TouchableOpacity } from 'react-native';
import {
    Container,
    Content,
    Text,
    DatePicker, Button, Card
} from 'native-base'
import moment from 'moment'
import { ListItem } from 'react-native-elements';
import { Navigation } from 'react-native-navigation';
import nbStyles from './Style'
import Style from '@Theme/Style'
import Star from 'react-native-star-view';
import LiveChat from 'react-native-livechat'
import CardTicket from '@Component/HelpDesk/CardTicket'
import OfflineNotice from '@Component/OfflineNotice';

export default class StatusHelp extends Component {
    _isMount = false;
    static options(passProps) {
        return {
            topBar: {
                noBorder: true
            },
            bottomTabs :{
                visible : false,
                drawBehind: true, 
                animate: true
            }
        }
    }

    constructor(props){
        super(props)

        this.state = {
            isDisabled : false,

            dataTower : [],
            dataStatus : [],
            dataTicket : [],
            dataTicketWhereStatus : [],

            email : '',
            debtor : '',
            group : '',
        }
        Navigation.events().bindComponent(this);
    }

    async componentDidMount(){
        this._isMount = true;
        const data = {
            email : await AsyncStorage.getItem('@User'),
            group : await AsyncStorage.getItem('@Group'),
            debtor : await AsyncStorage.getItem('@UserId'),
        }

        this.setState(data,()=>{
            this.getTower()
        })
    }

    getTower = () => {
        let email = this.state.email;

        fetch('http://35.198.219.220:2121/alfaAPI/c_product_info/getData/IFCAMOBILE/'+email,{
            method : "GET",
            headers : new Headers({
                'Token': 'JXmiUMx0+cg40ee5SU8Jc6xDKP7/XIfsTPjp1PdlLWptSTq/aaEJvTCTx4S98QeJdetlqFj2VbI+D6PqELUuk+5ZxxvS8ujvUdz0CqAS::268e8fa2a99a1dda0bae16f556d6403e'
            })
        })
        .then((response) => response.json())
        .then((res)=>{
            if(this._isMount){
                if(res.Error === false){
                    let resData = res.Data
                    this.setState({dataTower :resData},()=>{
                        this.getTicketStatus(resData)
                        // this.getTicket(resData)
                    })
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getTicketStatus = (data) => {
        const dT = data[0]

        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
            email : this.state.email
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_history/getTicketStatus/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(this._isMount){
                if(res.Error === false){
                    let resData = res.Data
                        this.setState({dataStatus : resData})
                }
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    getTicket = (data) => {
        const dT = data[0]
        
        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
            email : this.state.email,
            group : this.state.group,
            date_end : '',
            date_start : '',
            debtor : this.state.debtor
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_history/getDataTicket/IFCAPB/'+formData.group,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(this._isMount){
                if(res.Error === false){
                    const resData = res.Data
                    this.setState({dataTicket : resData})
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getTicketWhereStatus = (data,ticketStatus) => {
        const dT = data[0]
        // let endDate = this.state.endDate.getFullYear() + '/' + (this.state.endDate.getMonth() + 1) + '/'+ this.state.endDate.getDate()
        // let startDate = this.state.startDate.getFullYear() + '/' + (this.state.startDate.getMonth() + 1) + '/'+ this.state.startDate.getDate()

        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
            email : this.state.email,
            group : this.state.group,
            date_end : '',
            date_start : '',
            debtor : this.state.debtor,
            status : ticketStatus
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_history/getDataTicketWhereStatus/IFCAPB/'+formData.group,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData = res.Data
                // this.setState({dataTicketWhereStatus : resData})
                this.goToScreen(resData,'screen.ViewHistoryStatus')
            } else {
                this.setState({isDisabled:false})
            }
            // console.log('datar', res)
        }).catch((error) => {
            console.log(error);
        });
    }

    handleIndexChange = (index) => {
        this.setState({
            ...this.state,
            selectedIndex: index,
        });

        console.log('Selected index', this.state.selectedIndex)
    }

    handleNavigation =(data,ticketStatus)=>{
        this.setState({isDisabled:true},()=>{
            this.getTicketWhereStatus(data,ticketStatus);
        })
    }

    componentDidDisappear(){
        this.setState({isDisabled:false})
    }

    goToScreen = (data,screenName) => {
        Navigation.push(this.props.componentId, {
            component: {
                name: screenName,
                passProps : {
                    dataTicket : data,
                    email : this.state.email
                }
            }
        })
    }

    render() {
        const ds = this.state.dataStatus

        return (
            <Container>
                <OfflineNotice/>
                <Content>
                <View style={nbStyles.wrap}>
                    <Text style={nbStyles.title}>Status HelpDesk</Text>
                </View>                
                <View >
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'R'")} disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{ borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8 }}
                            title="Open"
                            titleStyle={{ fontSize: 16 }}
                            avatar={
                                <Image source={require('@Asset/images/icon_status/checklist.png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntopen, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#37BEB7' } }}

                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'A','S','M','P','F','Z'")}  disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{  borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8  }}
                            title="On Progress"
                            titleStyle={{ fontSize: 16}}
                            avatar={
                                <Image source={require('@Asset/images/icon_status/feature.png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntprogres, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#37BEB7'  } }}
                        />
                    </TouchableOpacity>
                    
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'C'")}   disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8 }}
                            title="Complete"
                            titleStyle={{ fontSize: 16 }}
                            avatar={
                                <Image source={require('@Asset/images/icon_status/jigsaw.png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntcompleted, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#37BEB7'  } }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>this.handleNavigation(this.state.dataTower,"'D'")}  disabled={this.state.isDisabled}>
                        <ListItem
                            containerStyle={{ borderColor: '#eee', backgroundColor: 'transparent', height: null, borderRadius:10, marginBottom:8 }}
                            title="Done"
                            titleStyle={{ fontSize:16}}
                            avatar={
                                <Image source={require('@Asset/images/icon_status/best-seller.png')} style={styles.img} />
                            }
                            badge={{ value: ds.cntdone, textStyle: { color: 'white' }, containerStyle: { width: null, backgroundColor: '#37BEB7'  } }}
                        />
                    </TouchableOpacity>
                </View>
                {/* {
                    this.state.dataTicket.map((data,key)=>
                        <CardTicket data={data} key={key} email={this.state.email} {...this.props}/>
                    )
                } */}
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    
    img: {
        borderRadius: 10,
        height: 35,
        width: 35,
        marginTop: 10
    }
});
  starStyle = {
    width: 100,
    height: 20,
    marginBottom: 20,
};