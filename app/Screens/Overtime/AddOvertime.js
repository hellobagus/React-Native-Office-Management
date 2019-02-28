import React, { Component } from "react";
import {
    View,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    AsyncStorage,
    ActivityIndicator,
    Alert
} from "react-native";
import {
    Container,
    Content,
    Text,
    DatePicker, 
    Title, Button, Icon, Right, Body, Left, Picker, Form, Header
} from 'native-base'
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment'
import nbStyles from './Style'
import Style from '@Theme/Style'
import ModalSelector from 'react-native-modal-selector'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import { Navigation } from "react-native-navigation";
import OfflineNotice from '@Component/OfflineNotice';


class AddOvertime extends Component {
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

    constructor(props) {
        super(props);
        this.state = { 
            chosenDate : props.chosenDate,
            dataTower : props.dataTower,
            dataLot : [],

            selectedTower : {
                dbProfile : '',
                entity : '',
                project : '',
                project_descs : ''
            },

            textLot : '',
            levelNo : '',
            debtorAcct : '',
            descsLevel : '',

            isVisible: false,
            startVisible:false,
            endVisible : false,
            dateVisible : false,

            startTime : moment(new Date()).format('HH:mm'),
            endTime : '00:00',

            isLoading : false
        };

        console.log('props', props)
        
        this.setDate = this.setDate.bind(this);
    }

    componentDidMount(){
        this._isMount =true
    }

    componentWillUnmount(){
        this._isMount = false
    }

    getLot = () => {
        this.setState({dataLot:[]})
        const dT = this.state.selectedTower

        const formData = {
            entity_cd : dT.entity,
            project_no : dT.project
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_overtime/zoom_lot_no/'+dT.dbProfile,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                let resData = res.Data;
                if(this._isMount){
                    this.setState({dataLot : resData})
                }
                
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    savaOvertime = async()=>{
        this.setState({isLoading : true})
        const dataTower = this.state.selectedTower
        const {textLot,debtorAcct,levelNo,descsLevel,startTime,endTime,chosenDate} = this.state

        const formData = {
            business_id : await AsyncStorage.getItem('@UserId'),
            entity : dataTower.entity,
            project_no : dataTower.project,
            ot_Id : 0,
            lotno : textLot + '-%-' + debtorAcct + '-%-' + levelNo + '-%-' + descsLevel,
            descs : 'Overtime ',
            ov_date : chosenDate,
            startHour : startTime+':00',
            endHour : endTime+':00'
        }

        console.log('formData', formData)

        fetch('http://35.198.219.220:2121/alfaAPI/c_overtime/save/'+dataTower.dbProfile,{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            this.setState({isLoading : false},()=>{
                this.showAlert(res.Pesan,res.Error)
            })     
        }).catch((error) => {
            console.log(error);
            this.setState({isLoading : false},()=>{
                this.showAlert('error',true)
            })    
        });
    }

    onValueChange(value: string) {
        this.setState({
            selected: value
        });
    }

    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }

    handleProjectChange =(tower) => {
        this.setState({
            selectedTower :{
                entity : tower.entity_cd,
                project : tower.project_no,
                project_descs : tower.project_descs,
                dbProfile : tower.db_profile
            }
        },()=>{
            this.getLot()
        })
    }

    handleLotChange =(lot) => {
        this.setState({
            textLot : lot.lot_no,
            levelNo : lot.level_no,
            debtorAcct : lot.debtor_acct,
            descsLevel : lot.descs_level
        })
    }

    handleIndexChange = (index) => {
        this.setState({
            ...this.state,
            selectedIndex: index,
        });

        console.log('Selected index', this.state.selectedIndex)
    }

    showPicker = (data) => data == 'startTime' ? this.setState({ startVisible: true }) : data == 'date' ? this.setState({ dateVisible: true }) : this.setState({ endVisible: true });
 
    hidePicker = (data) => data == 'startTime' ? this.setState({ startVisible: false }) : data == 'date' ? this.setState({ dateVisible: false }) : this.setState({ endVisible: false });
    
    handlePicker = (type,time) => {
        type == 'startTime' 
        ?
        this.setState({
            startVisible : false,
            startTime : moment(time).format('HH:mm')
        })
        :
        type == 'date' 
        ?
        this.setState({
            dateVisible : false,
            chosenDate : time
        })
        :
        this.setState({
            endVisible : false,
            endTime : moment(time).format('HH:mm')
        })

    };

    showAlert(data,errorkah) {
        Alert.alert(
        'Alert', data,
        [
            { text: 'OK', onPress: () => !errorkah ? Navigation.pop(this.props.componentId) : console.log('error')}
        ],
        { cancelable: false },
        );
    }

    render() {
        
        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    <View style={nbStyles.wrap} pointerEvents={this.state.isLoading ? 'none' : 'auto'}>
                        <View style={nbStyles.subWrap}>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                <Text style={nbStyles.title}>Add Overtime</Text>
                            </View>
                        </View>
                        <View style={nbStyles.subWrap}>
                            <View style={nbStyles.subWrap}>
                            <Text>Select Project</Text>
                                <ModalSelector
                                    data={this.state.dataTower}
                                    optionTextStyle={{color:"#333"}}
                                    selectedItemTextStyle={{color:'#3C85F1'}}
                                    accessible={true}
                                    keyExtractor= {item => item.project_no}
                                    labelExtractor= {item => item.project_descs}
                                    cancelButtonAccessibilityLabel={'Cancel Button'}
                                    onChange={(option)=>{ this.handleProjectChange(option)}}>
                                    <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                        placeholder="Project"
                                        editable={false}
                                        placeholderTextColor='#a9a9a9'
                                        value={this.state.selectedTower.project_descs}
                                    />
                                </ModalSelector>
                            </View>
                        
                            <View style={nbStyles.subWrap}>
                            <Text>Select Lot No</Text>
                                <ModalSelector
                                        data={this.state.dataLot}
                                        optionTextStyle={{color:"#333"}}
                                        selectedItemTextStyle={{color:'#3C85F1'}}
                                        accessible={true}
                                        keyExtractor= {item => item.lot_no}
                                        labelExtractor= {item => item.lot_no}
                                        cancelButtonAccessibilityLabel={'Cancel Button'}
                                        onChange={(option)=>{ this.handleLotChange(option)}}>
                                        <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                            placeholder="Lot No"
                                            editable={false}
                                            placeholderTextColor='#a9a9a9'
                                            value={this.state.textLot}
                                        />
                                </ModalSelector>
                            </View>

                            <View style={nbStyles.subWrap}>

                            {/*  Date  */}
                                <Text>Select Date</Text>
                                <TouchableOpacity onPress={(key)=>this.showPicker('date')}>
                                    <TextInput style={styles.inputDate} 
                                    placeholder="Select Date"
                                    editable={false}
                                    placeholderTextColor='#a9a9a9'
                                    value={moment(this.state.chosenDate).format('dddd, DD MMMM YYYY')}
                                    />
                                </TouchableOpacity>
                                <DateTimePicker
                                mode = {'date'}
                                is24Hour={true}
                                date={this.state.chosenDate}
                                isVisible={this.state.dateVisible}
                                minimumDate ={new Date()}
                                onConfirm={(val)=>{this.handlePicker('date',val)}}
                                onCancel={()=>this.hidePicker('date')}
                                />
                            </View>
                            
                            {/* Time */}
                            <View style={nbStyles.subWrap}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{ marginTop: 16 }}>
                                        <TouchableOpacity style={{alignItems:'center'}} onPress={(key)=>this.showPicker('startTime')}>
                                            <Text>Start Hour</Text>                                            
                                            <View pointerEvents='none'>
                                                <TextInput style={styles.inputTime} 
                                                    placeholder="Start Hour"
                                                    editable={false}
                                                    placeholderTextColor='#a9a9a9'
                                                    value={this.state.startTime}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <DateTimePicker
                                            mode = {'time'}
                                            is24Hour={true}
                                            date={new Date("December 25, 1995 "+this.state.startTime)}
                                            isVisible={this.state.startVisible}
                                            onConfirm={(val)=>{this.handlePicker('startTime',val)}}
                                            onCancel={()=>this.hidePicker('startTime')}
                                            datePickerModeAndroid={'spinner'}
                                        />
                                    </View>
                                    <View style={{ marginTop: 16, alignItems:'flex-end' }}>
                                        <TouchableOpacity style={{alignItems:'center'}}  onPress={this.showPicker}>
                                            <Text>End Hour</Text>
                                            <View pointerEvents='none'>
                                                <TextInput style={styles.inputTime} 
                                                placeholder="End Hour"
                                                editable={false}
                                                placeholderTextColor='#a9a9a9'
                                                value={this.state.endTime}
                                                />
                                            </View>
                                        </TouchableOpacity>
                                        <DateTimePicker
                                            mode = {'time'}
                                            // is24Hour={true}
                                            date={new Date("December 25, 1995 "+this.state.endTime)}
                                            isVisible={this.state.endVisible}
                                            onConfirm={(val)=>{this.handlePicker('endTime',val)}}
                                            onCancel={()=>this.hidePicker('endTime')}
                                            datePickerModeAndroid={'spinner'}
                                        />
                                    </View>
                                </View>
                            </View>
                            <View style={nbStyles.subWrap}>
                                <Button block style={Style.buttonSubmit} onPress={()=>this.savaOvertime()}>
                                    {this.state.isLoading === false ?
                                        <Text>SUBMIT</Text>
                                    :
                                        <ActivityIndicator size="large" color="#fff"/>
                                    }
                                    
                                </Button>
                            </View>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
export default AddOvertime;


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

    inputTime :{
        height: 40,
        backgroundColor: '#f5f5f5',
        color:"black",
        paddingHorizontal: 10,
        marginBottom: 16,
        width: 90,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign : 'center'
    },
    inputDate :{
        height: 40,
        backgroundColor: '#f5f5f5',
        color:"black",
        paddingHorizontal: 10,
        marginBottom: 16,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign : 'left'
    }
})