import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SegmentedControlIOS,
    TextInput,
    AsyncStorage
} from "react-native";
import {
    Container,
    Content,
    Text,
    DatePicker, Button
} from 'native-base'
import nbStyles from './Style'
import ModalSelector from 'react-native-modal-selector'

import Style from '@Theme/Style'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import {Navigation} from 'react-native-navigation';
import OfflineNotice from '@Component/OfflineNotice';



class HistoryHelp extends Component {
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

    constructor(props) {
        super(props);
        this.state = { 
            chosenDate: new Date(),
            dataDebtor : [],
            dataTower : [],

            email : '',
            debtor : '',
            group : '',
            typeTicket : "'C','R'",

            textDebtor : '',
            startDate : new Date(2018,10,10),
            endDate : new Date(2019, 2, 1)
         };
    }

    async componentWillMount(){
        const data = {
            email : await AsyncStorage.getItem('@User'),
            group : await AsyncStorage.getItem('@Group'),
            debtor : await AsyncStorage.getItem('@Debtor'),
            textDebtor : await AsyncStorage.getItem('@Debtor')
        } 

        this.setState(data,()=>{
            this.getTower()
        })
    }

    // componentDidMount(){
    //     this.getDebtor()
    // }
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
            if(res.Error === false){
                let resData = res.Data
                for(var i = 0 ; i < resData.length; i++){
                    
                    this.setState(prevState => ({
                        dataTower: [...prevState.dataTower, resData[i]]
                    }))
                }
                this.getDebtor()
            }
        }).catch((error) => {
            console.log(error);
        });
    }
    getDebtor = () => {

        const formData = {
            email : this.state.email,
        }
        // console.log('dataTowe', formData)

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_history/getDebtorAll/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData = res.Data
                // for(var i = 0 ; i < resData.length; i++){
                    
                //     this.setState(prevState => ({
                //         dataDebtor: [...prevState.dataDebtor, resData[i]]
                //     }))
                // }

                this.setState({dataDebtor : resData})
                // this.setDefault()
                
                // this.setState({
                //     debtor : resData[0].debtor_acct,
                //     textDebtor : resData[0].name
                // })
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getTicket = () => {
        const dT = this.state.dataTower[0]
        let endDate = this.state.endDate.getFullYear() + '/' + (this.state.endDate.getMonth() + 1) + '/'+ this.state.endDate.getDate()
        let startDate = this.state.startDate.getFullYear() + '/' + (this.state.startDate.getMonth() + 1) + '/'+ this.state.startDate.getDate()

        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
            email : this.state.email,
            group : this.state.group,
            date_end : endDate,
            date_start : startDate,
            debtor : this.state.debtor,
            typeTicket : this.state.typeTicket,
            status : "'C','D'"
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_history/getDataTicketWhereStatus/IFCAPB/'+formData.group,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData = res.Data
                this.goToScreen(resData,'screen.ViewHistory')
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    // setDefault = async ()=>{
    //     const defaults ={
            
    //     } 
    //     console.log('aa', defaults)
    //     this.setState(defaults)
    // }

    handleChangeModal = (data) => {
        console.log('dataDeb', data)
        this.setState({
            debtor : data.debtor_acct,
            textDebtor:data.name
        })
    }

    handleIndexChange = (index) => {
        let typeTickets = index == 0 ? "'C','R'" : "'A'"

        this.setState({
            ...this.state,
            selectedIndex: index,
            typeTicket : typeTickets
        });

        console.log('Selected index', this.state.selectedIndex)
    }
    goToScreen = (data,screenName) => {
        Navigation.push(this.props.componentId,{
            component:{
                name : screenName,
                passProps : {
                    dataTicket :data
                }
            }
        })
    }

    render() {
        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    <View style={nbStyles.wrap}>
                        <View style={nbStyles.subWrap}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

                                <Text style={nbStyles.title}>History</Text>
                            </View>
                        </View>
                        <View style={nbStyles.subWrap}>

                            <SegmentedControlTab
                                values={['Ticket', 'Application']}
                                selectedIndex={this.state.selectedIndex}
                                onTabPress={this.handleIndexChange}
                                activeTabStyle={nbStyles.activeTabStyle}
                                activeTabTextStyle={nbStyles.activeTabTextStyle}
                                tabStyle={nbStyles.tabStyle}
                                tabTextStyle={nbStyles.tabTextStyle}
                            />
                        </View>
                        <Text style={{ fontSize: 12, marginLeft: 12, marginTop: 16 }}>
                            Date: {this.state.chosenDate.toString().substr(4, 12)}
                        </Text>                    
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View style={{ marginTop: 16 }}>
                                <DatePicker
                                    defaultDate={new Date(2018, 4, 4)}
                                    minimumDate={new Date(2018, 1, 1)}
                                    maximumDate={new Date(2018, 12, 31)}
                                    locale={"id"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Select date"
                                    textStyle={{ color: "green" }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={(val)=>this.setState({startDate : val})}
                                    disabled={false}
                                />
                                
                            </View>
                            <View style={{ marginTop: 16 }}>
                                <DatePicker
                                    defaultDate={new Date(2018, 4, 4)}
                                    minimumDate={new Date(2018, 1, 1)}
                                    maximumDate={new Date(2018, 12, 31)}
                                    locale={"id"}
                                    timeZoneOffsetInMinutes={undefined}
                                    modalTransparent={false}
                                    animationType={"fade"}
                                    androidMode={"default"}
                                    placeHolderText="Select date"
                                    textStyle={{ color: "green" }}
                                    placeHolderTextStyle={{ color: "#d3d3d3" }}
                                    onDateChange={(val)=>this.setState({endDate : val})}
                                    disabled={false}
                                />
                            </View>
                        </View>
                        <View style={nbStyles.subWrap}>

                            <View>
                                <ModalSelector
                                    data={this.state.dataDebtor}
                                    accessible={true}
                                    keyExtractor= {item => item.debtor_acct}
                                    labelExtractor= {item => item.name}
                                    optionTextStyle={{color:"#333"}}
                                    selectedItemTextStyle={{color:'#3C85F1'}}
                                    def
                                    // scrollViewAccessibilityLabel={'Scrollable options'}
                                    cancelButtonAccessibilityLabel={'Cancel Button'}
                                    onChange={(option)=>{ this.handleChangeModal(option)}}>
                                    <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                        placeholder="Debtor"
                                        editable={false}
                                        placeholderTextColor='#a9a9a9'
                                        value={this.state.textDebtor}
                                    />
                                </ModalSelector>
                            </View>
                        </View>
                        <View style={nbStyles.subWrap}>
                            <Button block style={Style.buttonSubmit} onPress={()=>this.getTicket()}>
                                <Text>View</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
export default HistoryHelp;
const styles = StyleSheet.create({

    input :{
        height: 40,
        backgroundColor: '#f5f5f5',
        color:"black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: null,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    inputs :{
        height: 80,
        backgroundColor: '#f5f5f5',
        color:"black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: null,
        borderRadius: 10,
    }
})

