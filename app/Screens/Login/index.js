import React, { Component } from "react";
import {View,TouchableOpacity,ImageBackground, TextInput,Platform,Image,AsyncStorage,Alert } from "react-native";
import { Container, Content, Text, Badge, Form, Item, Label, Input, Button, Icon, Header, Left, Body, Thumbnail} from 'native-base'
import nbStyles from './Style'
import Style from '@Theme/Style'
import DeviceInfo from 'react-native-device-info';
import { goHome } from '../navigation'
import firebase from 'react-native-firebase'
import { USER_KEY } from '../config'
import OfflineNotice from '@Component/OfflineNotice';


class Login extends Component {

    static options(passProps) {
        return{
            topBar: {
                visible :false,
                height:0                
            },
            bottomTabs:{
                visible :false,
                drawBehind:true
            }
        }
    }

    constructor(props) {
        super(props);
        
        this.state = {
            //This below for Control
            icEye: 'visibility-off',
            avPassword: true,
            device :'',
            token:'',
            isCorrect :'',
            showSpinner:false,

            //This below for form text
            passwordTextInput:'',
            emailTextInput:'',
            
            // This below for Alert
            showAlert : false,
            themeAlert : 'info',
            titleAlert : '',
            subtitleAlert: '',
            titleButtonAlert:'Close',

            // This below for Validator
            emailError : '',
            passwordError : '',

            data : []

        }
    }

    onChangeText = (key, value) => {
        this.setState({ [key]: value })
    }

    async componentDidMount(){
        if(Platform.OS === 'android'){
            // this.setState({device:Platform.OS})
        } else if(Platform.OS === 'ios'){
            // Alert.alert('This is iOS');
        }
        this.setState({device:Platform.OS});

        this.checkPermission();
        this.createNotificationListeners();
    }

    btnLoginClick = async () => {
        const mac = await DeviceInfo.getMACAddress().then(mac => {return mac});
        const formData = {
            email : this.state.emailTextInput,
            password : this.state.passwordTextInput,
            token : '',
            token_firebase : this.state.token,
            device : this.state.device,
            mac : mac
        }
        var lengthPass = this.state.passwordTextInput.length;
        if(lengthPass < 4 ){
            this.setState({isCorrect:false,titleButtonAlert:"Try Again"});
        }else{
        this.doLogin(formData);
        }
        
        
    }

    async doLogin(value){
        
        this.setState({showSpinner: !this.state.showSpinner});
        data = JSON.stringify(value);

        fetch('http://35.198.219.220:2121/alfaAPI/c_auth/Login',{
            method:'POST',
            headers : {
                'Accept':'application/json',
                'Content-Type' : 'application/json',
            },
            body : data
        }).then((response) => response.json())
        .then((res)=>{
            if(!res.Error){
                this.signIn(res)
            } else {
                alert("Error")
            }

            console.log('errorkah', res);
        }).catch((error) => {
            console.log(error);
          });
        
    }

    signIn = async (res) => {
        console.log('resones', res)
        const { emailTextInput, passwordTextInput } = this.state
        try {
            // login with provider
            const user = await AsyncStorage.setItem(USER_KEY, emailTextInput)
            console.log('user successfully signed in!', user)

            this._storeData('@UserId', res.Data.UserId);
            this._storeData('@Name', res.Data.name);
            this._storeData('@Token', res.Data.Token);
            this._storeData('@User', res.Data.user);
            this._storeData('@Group', res.Data.Group);
            this._storeData("@isLogin","true");
            this._storeData("@isReset",res.Data.isResetPass.toString());
            this._storeData("@AgentCd",res.Data.AgentCd?res.Data.AgentCd:'');
            this._storeData("@Debtor",res.Data.Debtor_acct?res.Data.Debtor_acct:'');
            this._storeData('@rowID', res.Data.rowID.toString());
            this._storeData('@RefreshProfile', "false");

            
            goHome()
        } catch (err) {
          console.log('error:', err)
        }
    }

    _storeData = async (name,data) =>{
        try {
            await AsyncStorage.setItem(name,data)
        } catch (error) {
            console.log('ErrorStoreData', error)
        }
    }

    renderHeader(){
        return(
            <Header style={Style.navigationTransparent}>
                <View style={Style.actionBarLeft}>
                    <Button transparent style={Style.actionBarBtn} 
                    onPress={() => {Navigation.pop(this.props.componentId)}}>
                        <Icon active name='arrow-left' style={Style.textWhite} type="MaterialCommunityIcons" />
                    </Button>
                </View>
            </Header>
        )
    }

    async checkPermission() {

        const enabled = await firebase.messaging().hasPermission();
        if (enabled) {
            this.getToken();
    
        } else {
            this.requestPermission();
        }
      }
    
    async getToken() {
    
        let fcmToken = await AsyncStorage.getItem('fcmToken');
        // console.log('fcmToken', fcmToken);
        if (!fcmToken) {
            fcmToken = await firebase.messaging().getToken();
            if (fcmToken) {
                // user has a device token
                await AsyncStorage.setItem('token', fcmToken);
                console.log('fcmToken', fcmToken);
                this.setState({
                    token : fcmToken
                })
            }
        }
    }
    
    async requestPermission() {
        try {
            await firebase.messaging().requestPermission();
            // User has authorised
            this.getToken();
        } catch (error) {
            // User has rejected permissions
            console.log('permission rejected');
        }
    }
    
    async createNotificationListeners() {
        // firebase.notifications().setBadge(3)
        /*
        * Triggered when a particular notification has been received in foreground
        * */
        this.notificationListener = firebase.notifications().onNotification((notification) => {
            const { title, body } = notification;
            this.showAlert(title, body);
        });
      
        /*
        * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
        * */
        this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        });
      
        /*
        * If your app is closed, you can check if it was opened by a notification being clicked / tapped / opened as follows:
        * */
        const notificationOpen = await firebase.notifications().getInitialNotification();
        if (notificationOpen) {
            const { title, body } = notificationOpen.notification;
            this.showAlert(title, body);
        }
        /*
        * Triggered for data only payload in foreground
        * */
        this.messageListener = firebase.messaging().onMessage((message) => {
          //process data message
          console.log(JSON.stringify(message));
        });
    }

    
      
    showAlert(title, body) {
        Alert.alert(
          title, body,
          [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
          ],
          { cancelable: false },
        );
    }
    render() {
       
        return (
            <Container style={nbStyles.content}>
                <ImageBackground source={require('@Img/loginbg.png')} style={{flex:1, resizeMode: 'cover'}}>
                    {/* {this.renderHeader()} */}
                    <OfflineNotice/>
                    <View style={Style.LogoLeftTopWarp}>
                        <Image source={require('@Asset/images/logo.png')} />
                    </View>
                    <Content>
                    <View style={nbStyles.wrap}>
                        <View>
                            <Text style={nbStyles.title}>Login</Text>
                        </View>
                        <View style={nbStyles.textInputWrap}>
                            <TextInput style={nbStyles.textInput} placeholder={'Email Address'} 
                            onChangeText={val => this.onChangeText('emailTextInput',val)}/>
                        </View>
                        <View style={nbStyles.textInputWrap}>
                            <TextInput style={nbStyles.textInput} placeholder={'Password'} secureTextEntry={true}
                            onChangeText={val => this.onChangeText('passwordTextInput',val)}/>
                        </View>
                        <View style={nbStyles.subWrap1}>
                            <Button style={nbStyles.btnYellow} 
                             onPress={this.btnLoginClick}>
                                <Text style={nbStyles.loginBtnText}>{'Login'.toUpperCase()}</Text>
                                <Icon active name='arrow-right' type="MaterialCommunityIcons" style={nbStyles.loginBtnIcon} />
                            </Button>
                        </View>
                        {/* <View>
                            <Text style={nbStyles.subTitle}>OR</Text>
                        </View>
                        <View style={nbStyles.subWrap2}>
                            <Button style={nbStyles.btnBlue} >
                                <Text style={nbStyles.loginBtnText}>{'Login With Facebook'.toUpperCase()}</Text>
                                <Icon active name='arrow-right' type="MaterialCommunityIcons" style={nbStyles.loginBtnIcon} />
                            </Button>
                        </View> */}
                    </View>
                    </Content>
                </ImageBackground>
            </Container>
        );
    }
}
export default Login;
