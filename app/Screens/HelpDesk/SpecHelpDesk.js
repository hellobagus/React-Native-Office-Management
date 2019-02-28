import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SegmentedControlIOS,
    TextInput,
    Picker,
    Switch,
    AsyncStorage,
    ActivityIndicator
} from "react-native";
import {Container, Content, Text, H2, Icon, List, ListItem,Button} from 'native-base'
import nbStyles from './Style'
import Spinner from 'react-native-loading-spinner-overlay'
import ModalSelector from 'react-native-modal-selector'
import Style from '@Theme/Style'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import {CheckBox} from 'react-native-elements'
import {Navigation} from 'react-native-navigation';
import Title from '@Component/Title'
import SubTitle from '@Component/SubTitle'
import OfflineNotice from '@Component/OfflineNotice';

class SpecHelpDesk extends Component {

    _isMount = false;

    static options(passProps){
        return {
            topBar : {
                noBorder:true,
            },
            bottomTabs :{
                visible : false,
                drawBehind: true, 
                animate: true
            }
        }
    }
    
    constructor(props){
        super(props);

        this.state = {
            isDisabled : false,
            rowId : '',
            email : '',
            business_id : '',
            debtor : '',
            entity : '',
            project : '',
            audit_user : '',

            ticketNo: 0,
            seqNo: 0,
            comSource : 0,

            selectedIndex : 0,
            typeTicket : 'C',
            appType : '',

            dataTower : [],
            dataDebtor : [],
            dataLot : [],
            dataApplicationType : [],

            textUsername : '',
            textDebtor: '',
            textLot : '',
            textContact : '',
            textAppType:'',
            textFloor : '',

            checked :false,
            spinner : true,
        }

        this.handleCheckChange = this.handleCheckChange.bind(this);
        this.navigationEventListener = Navigation.events().bindComponent(this);
    }

    async componentDidMount(){
        this._isMount = true;

        const datas =  {
            textUsername : await AsyncStorage.getItem("@Name"),
            audit_user : await AsyncStorage.getItem("@Name"),
            email : await AsyncStorage.getItem("@User"),
            debtor : await AsyncStorage.getItem("@Debtor"),
            business_id : await AsyncStorage.getItem('@UserId'),
            rowId : await AsyncStorage.getItem('@rowID')
        }

        this.loadData(datas)

    }

    loadData = (datas) => {
        if(this._isMount){
            this.setState(datas,()=>{
                this.getTower()
                this.getApplicationType()
            })
        }
    }

    componentWillUnmount(){
        this._isMount = false;
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
            if(res.Error === false){
                let resData = res.Data
                if(this._isMount){
                    this.setState({dataTower : resData, spinner: false},()=>{
                        this.getTicketNo()
                        this.getSeqNo()
                        this.getComSource()
                    })
                }
            } else {
                if(this._isMount){
                    this.setState({spinner:false})
                }
            }

        }).catch((error) => {
            this.setState({spinner:false})
            console.log(error);
        });
    }

    getApplicationType = () =>{

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_entry/getApplicationType/IFCAPB',{
            method : "GET",
            headers : new Headers({
                'Token': 'JXmiUMx0+cg40ee5SU8Jc6xDKP7/XIfsTPjp1PdlLWptSTq/aaEJvTCTx4S98QeJdetlqFj2VbI+D6PqELUuk+5ZxxvS8ujvUdz0CqAS::268e8fa2a99a1dda0bae16f556d6403e'
            })
        })
        .then((response) => response.json())
        .then((res)=>{
            this.setState({dataApplicationType : []})
            if(res.Error === false){
                let resData = res.Data
                if(this._isMount){
                    this.setState({dataApplicationType : resData})
                }
            }
        }).catch((error) => {
            this.setState({spinner:false})            
            console.log(error);
        });
    }

    getTicketNo = () => {
        const dT = this.state.dataTower[0]

        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_entry/getTicketNo/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                let resData = res.Data
                if(this._isMount){
                    this.setState({ticketNo : resData})
                }
            }
        }).catch((error) => {
            this.setState({spinner:false})
            console.log(error);
        });
    }

    getSeqNo = () => {
        const dT = this.state.dataTower[0]

        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_entry/getSeqNoTicket/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                let resData = res.Data
                if(this._isMount){
                    this.setState({seqNo : resData})
                }
                // console.log('response', resData)
            }
        }).catch((error) => {
            this.setState({spinner:false})
            console.log(error);
        });
    }

    getComSource = () => {
        const dT = this.state.dataTower[0]

        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_entry/getComsource/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                let resData = res.Data
                if(this._isMount){
                    this.setState({comSource : resData})
                }
            }
        }).catch((error) => {
            this.setState({spinner:false})
            console.log(error);
        });
    }

    getDebtor = (data) => {
        const dT = data

        const formData = {
            entity : dT.entity_cd,
            project : dT.project_no,
            email : this.state.email,
        }
        // console.log('dataTowe', formData)

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_entry/getDebtor/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                let resData = res.Data
                if(this._isMount){
                    this.setState({dataDebtor : resData,spinner:false})
                }
            }
            console.log('Debtor',res)
        }).catch((error) => {
            this.setState({spinner:false})
            console.log(error);
        });
    }

    getLot = () => {
        const {entity,project,textDebtor,business_id,email} = this.state

        const formData = {
            entity : entity,
            project : project,
            debtor : textDebtor, 
            business_id : business_id,
            email : email
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_entry/getLotno/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                console.log('ResData', JSON.stringify(res.Data))
                let resData = res.Data;

                if(this._isMount){
                    this.setState({dataLot : resData,spinner:false})
                }
            }

        }).catch((error) => {
            this.setState({spinner:false})
            console.log(error);
        });
    }

    getFloor = () => {
        const dT = this.state.textLot

        const formData = {
            lotno : dT
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_ticket_entry/getFloor/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                const resData =  JSON.stringify(res.Data)
                if(this._isMount){
                    this.setState({textFloor : resData})
                }
            }

        }).catch((error) => {
            console.log(error);
        });
    }

    handleLotChange =(lot) => {
        this.setState({textLot : lot})
        this.getFloor()

    }

    handleCheckChange = (index,data) => {
        this.setState({
            checked: index,
            entity : data.entity_cd,
            project : data.project_no,
        })
        this.getDebtor(data)
        console.log('daa', data)
    }

    handleChangeModal = (data) => {
        console.log('dataDeb', data)
        this.setState({
            debtor : data.debtor_acct,
            textDebtor:data.name,
            spinner : true
        },()=>{
            this.getLot(data.debtor_acct)
        })
    }

    handleChangeApplicationType = (data) =>{
        console.log('dataDebs', data)
        this.setState({
            appType : data.category_cd,
            textAppType: data.descs
        })
    }

    handleIndexChange = (index) => {
        
        let type = '';
        if(index == 0){
            type = 'C'
        } else if(index==1) {
            type = 'R'
        } else if(index == 2){
            type = 'A'
        }
        

        this.setState({
            ...this.state,
            selectedIndex: index,
            typeTicket : type,
            appType : '',
            textAppType : ''
          });

        console.log('Selected index', this.state.selectedIndex)
    }

    handleNavigation = () => {
        this.setState({isDisabled:true},()=>{
            if(this.state.appType == ''){
                this.goToScreen('screen.CategoryHelp')
            } else {
                this.goToScreen('screen.SubmitHelpDesk')
            }
        })
        
    }

    goToScreen = (screenName) => {
        Navigation.push(this.props.componentId,{
            component:{
                name : screenName,
                passProps : {
                    prevProps : this.state
                }
            }
        })
    }
      
    componentDidDisappear(){
        this.setState({isDisabled:false});
    }

    render() {
        let index = 0;
        const data = [];
        this.state.dataDebtor.map((data,key)=>
            data = data
        )

        return (
            <Container>
                <OfflineNotice/>
                <Content>

                    <View>
                        <Spinner visible={this.state.spinner} />
                    </View>

                    <View style={nbStyles.wrap}>
                        <Title text="Ticket"/>
                        <SubTitle text="Specification Help Desk"/>
                        <View style={nbStyles.subWrap}>
                            
                            <SegmentedControlTab
                            values={['Complain', 'Request', 'Application']}
                            selectedIndex={this.state.selectedIndex}
                            onTabPress={this.handleIndexChange}
                            activeTabStyle={nbStyles.activeTabStyle}
                            activeTabTextStyle={nbStyles.activeTabTextStyle}
                            tabStyle={nbStyles.tabStyle}
                            tabTextStyle={nbStyles.tabTextStyle}
                            />
                            <View style={nbStyles.subWrap2}>
                                {this.state.dataTower.map((data,key)=>
                                    <CheckBox 
                                        key = {key}
                                        checkedIcon = "dot-circle-o"
                                        uncheckedIcon = "circle-o"
                                        title={data.project_descs}
                                        checked={this.state.checked === key}
                                        onPress={() => this.handleCheckChange(key,data)}
                                    />
                                )}
                            </View>
                            {/* SELECT TAB OPTION IN HERE */}

                                {/* SELECTED TAB COMPLAIN */}
                                {this.state.selectedIndex === 0 &&
                                <View style={nbStyles.subWrap}>
                                    <View>
                                        <View>
                                            <ModalSelector
                                                data={this.state.dataDebtor}
                                                accessible={true}
                                                keyExtractor= {item => item.debtor_acct}
                                                labelExtractor= {item => item.name}
                                                optionTextStyle={{color:"#333"}}
                                                selectedItemTextStyle={{color:'#3C85F1'}}
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
                                        
                                        <TextInput style={styles.input}
                                                placeholder="Request By"
                                                placeholderTextColor='#a9a9a9'
                                                keyboardType='default'
                                                returnKeyType='next'
                                                autoCorrect={false}
                                                ref={"txtRequest"}
                                                value={this.state.textUsername}
                                                onChangeText={(text)=> this.setState({textUsername : text})}
                                                onSubmitEditing={()=> this.refs.txtContact.focus()}
                                        />
                                        <ModalSelector
                                                data={this.state.dataLot}
                                                optionTextStyle={{color:"#333"}}
                                                selectedItemTextStyle={{color:'#3C85F1'}}
                                                accessible={true}
                                                keyExtractor= {item => item.lot_no}
                                                labelExtractor= {item => item.lot_no}
                                                // scrollViewAccessibilityLabel={'Scrollable options'}
                                                cancelButtonAccessibilityLabel={'Cancel Button'}
                                                onChange={(option)=>{ this.handleLotChange(option.lot_no)}}>
                                                <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                                    placeholder="Lot No"
                                                    editable={false}
                                                    placeholderTextColor='#a9a9a9'
                                                    value={this.state.textLot}
                                                />
                                        </ModalSelector>
                                        <TextInput style={styles.input}
                                                placeholder="Contact No"
                                                placeholderTextColor='#a9a9a9'
                                                keyboardType='number-pad'
                                                returnKeyType='next'
                                                autoCorrect={false}
                                                ref={"txtContact"}
                                                value={this.state.textContact}
                                                onChangeText={(text)=> this.setState({textContact : text})}
                                                onSubmitEditing={()=> this.refs.txtLot.focus()}
                                        />
                                    </View>
                                </View>
                                }
                                {/* END TAB COMPLAIN */}

                                {/* SELECTED TAB REQUEST */}
                                {this.state.selectedIndex === 1 &&
                                <View style={nbStyles.subWrap}>
                                    <View>
                                        <View>
                                            <ModalSelector
                                                data={this.state.dataDebtor}
                                                accessible={true}
                                                keyExtractor= {item => item.debtor_acct}
                                                labelExtractor= {item => item.name}
                                                optionTextStyle={{color:"#333"}}
                                                selectedItemTextStyle={{color:'#3C85F1'}}
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
                                        
                                        <TextInput style={styles.input}
                                                placeholder="Request By"
                                                placeholderTextColor='#a9a9a9'
                                                keyboardType='default'
                                                returnKeyType='next'
                                                autoCorrect={false}
                                                ref={"txtRequest"}
                                                value={this.state.textUsername}
                                                onChangeText={(text)=> this.setState({textUsername : text})}
                                                onSubmitEditing={()=> this.refs.txtContact.focus()}
                                        />
                                        <ModalSelector
                                                data={this.state.dataLot}
                                                optionTextStyle={{color:"#333"}}
                                                selectedItemTextStyle={{color:'#3C85F1'}}
                                                accessible={true}
                                                keyExtractor= {item => item.lot_no}
                                                labelExtractor= {item => item.lot_no}
                                                // scrollViewAccessibilityLabel={'Scrollable options'}
                                                cancelButtonAccessibilityLabel={'Cancel Button'}
                                                onChange={(option)=>{ this.handleLotChange(option.lot_no)}}>
                                                <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                                    placeholder="Lot No"
                                                    editable={false}
                                                    placeholderTextColor='#a9a9a9'
                                                    value={this.state.textLot}
                                                />
                                        </ModalSelector>
                                        <TextInput style={styles.input}
                                                placeholder="Contact No"
                                                placeholderTextColor='#a9a9a9'
                                                keyboardType='number-pad'
                                                returnKeyType='next'
                                                autoCorrect={false}
                                                ref={"txtContact"}
                                                value={this.state.textContact}
                                                onChangeText={(text)=> this.setState({textContact : text})}
                                                onSubmitEditing={()=> this.refs.txtLot.focus()}
                                        />
                                        
                                        {/* <TextInput style={styles.input}
                                                placeholder="Lot"
                                                placeholderTextColor='#a9a9a9'
                                                keyboardType='default'
                                                returnKeyType='go'
                                                autoCorrect={false}
                                                ref={"txtLot"}
                                        /> */}
                                    </View>
                                </View>
                                }
                                {/* END TAB REQUEST */}

                                {/* SELECTED TAB APPLICATION */}
                                {this.state.selectedIndex === 2 &&
                                <View style={nbStyles.subWrap}>
                                    <View>
                                        <View>
                                            <ModalSelector
                                                data={this.state.dataApplicationType}
                                                accessible={true}
                                                keyExtractor= {item => item.category_cd}
                                                labelExtractor= {item => item.descs}
                                                optionTextStyle={{color:"#333"}}
                                                selectedItemTextStyle={{color:'#3C85F1'}}
                                                // scrollViewAccessibilityLabel={'Scrollable options'}
                                                cancelButtonAccessibilityLabel={'Cancel Button'}
                                                onChange={(option)=>{ this.handleChangeApplicationType(option)}}>
                                                <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                                    placeholder="Application Type"
                                                    editable={false}
                                                    placeholderTextColor='#a9a9a9'
                                                    value={this.state.textAppType}
                                                />
                                            </ModalSelector>
                                        </View>
                                        <TextInput style={styles.input}
                                                placeholder="Request By"
                                                placeholderTextColor='#a9a9a9'
                                                keyboardType='default'
                                                returnKeyType='next'
                                                autoCorrect={false}
                                                ref={"txtRequest"}
                                                value={this.state.textUsername}
                                                onChangeText={(text)=> this.setState({textUsername : text})}
                                                onSubmitEditing={()=> this.refs.txtContact.focus()}
                                        />
                                        <View>
                                            <ModalSelector
                                                data={this.state.dataDebtor}
                                                accessible={true}
                                                keyExtractor= {item => item.debtor_acct}
                                                labelExtractor= {item => item.name}
                                                optionTextStyle={{color:"#333"}}
                                                selectedItemTextStyle={{color:'#3C85F1'}}
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
                                        <ModalSelector
                                                data={this.state.dataLot}
                                                optionTextStyle={{color:"#333"}}
                                                selectedItemTextStyle={{color:'#3C85F1'}}
                                                accessible={true}
                                                keyExtractor= {item => item.lot_no}
                                                labelExtractor= {item => item.lot_no}
                                                // scrollViewAccessibilityLabel={'Scrollable options'}
                                                cancelButtonAccessibilityLabel={'Cancel Button'}
                                                onChange={(option)=>{ this.handleLotChange(option.lot_no)}}>
                                                <TextInput style={styles.input} onFocus={() => this.selector.open()} 
                                                    placeholder="Lot No"
                                                    editable={false}
                                                    placeholderTextColor='#a9a9a9'
                                                    value={this.state.textLot}
                                                />
                                        </ModalSelector>
                                        <TextInput style={Style.input}
                                                placeholder="Contact No"
                                                placeholderTextColor='#a9a9a9'
                                                keyboardType='number-pad'
                                                returnKeyType='next'
                                                autoCorrect={false}
                                                ref={"txtContact"}
                                                value={this.state.textContact}
                                                onChangeText={(text)=> this.setState({textContact : text})}
                                                onSubmitEditing={()=> this.refs.txtLot.focus()}
                                        />
                                        
                                        {/* <TextInput style={styles.input}
                                                placeholder="Lot"
                                                placeholderTextColor='#a9a9a9'
                                                keyboardType='default'
                                                returnKeyType='go'
                                                autoCorrect={false}
                                                ref={"txtLot"}
                                        /> */}
                                    </View>
                                </View>
                                }
                                {/* END TAB APPLICATION */}

                            {/* SELECTED TAB END */}
                        </View>
                        
                        <View style={nbStyles.subWrap}>
                            <Button block style={Style.buttonSubmit} onPress={()=>this.handleNavigation()} disabled={this.state.isDisabled}>
                                <Text>Next</Text>
                            </Button>
                        </View>
                    </View>
                </Content>
            </Container>
        );
    }
}
export default SpecHelpDesk;


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
})
