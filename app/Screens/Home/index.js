import React, { Component } from "react";
import {
    ScrollView,
    View,
    SafeAreaView,
    Image,
    TouchableOpacity,
    Dimensions,
    StatusBar,
    Platform,
    AsyncStorage,
    RefreshControl,
    Animated,
} from 'react-native'
import {
    Container,
    Content,
    Text,
    Thumbnail,
    H3,
    Button,
    Header,
    Left,
    Body,
    Card,
    Icon
} from 'native-base';

import CategoryMenu from '@Component/Home/Category/CategoryMenu'
import News from '@Component/Home/Category/News'
import { Navigation } from 'react-native-navigation';
import { USER_KEY } from '../config'
const { height, width } = Dimensions.get('window');
import OfflineNotice from '@Component/OfflineNotice';


HEADER_MAX_HEIGHT = 100
HEADER_MIN_HEIGHT = 25
PROFILE_IMAGE_MAX_HEIGHT = 80
PROFILE_IMAGE_MIN_HEIGHT = 40


class Home extends React.Component {
    static navigatorStyle = {
        navBarBlur: false, // The background is still blurred
        drawUnderNavBar: true,
        drawUnderTabBar: true,
        navBarTranslucent: true
    };

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            isDisable : false,
            name: 'HelloBagus',
            totalInvoice: 999,
            totalInvoiceDue: '999.999.999.00',
            dateNow: 0,
            token :'',

            mounted: false,
            fotoProfil : require('@Asset/images/profile.png'),            

            username: '',
            dash: [],
            dataNews : [],
            dataTower : [],
            dataProfile :[],


            scrollY: new Animated.Value(0)
        }

        Navigation.events().bindComponent(this);

    }


    async componentWillMount(){
        this.startHeaderHeight = 150
        if (Platform.OS == 'android') {
            this.startHeaderHeight = 100 + StatusBar.currentHeight
        }

        const data = {
            email : await AsyncStorage.getItem('@User'),
            name : await AsyncStorage.getItem('@Name'),
            token : await AsyncStorage.getItem('@Token'),
            userId : await AsyncStorage.getItem('@UserId'),

            mounted : true
        } 

        this.setState(data,()=>{
            this.getInvoice()
            this.getTower()
            this.getProfile()
        })
    }

    async componentDidAppear(){
        let refresh = await AsyncStorage.getItem('@RefreshProfile')
        if(this.state.mounted){
            if(refresh === "true"){
                this._storeData("@RefreshProfile","false")
                this.getProfile();
            }
        }
    }

    getProfile = () => {
        
        fetch('http://35.198.219.220:2121/alfaAPI/c_profil/getData/IFCAMOBILE/'+this.state.email+'/'+this.state.userId,{
            method : "GET",
            headers :{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Token' : this.state.token
            }
        })
        .then((response) => response.json())
        .then((res)=>{
              const resData = res.Data[0];

              // ? Agar Gambar Tidak ter cache 
              let url = resData.pict + '?random_number=' + new Date().getTime()
              this.setState({dataProfile:resData,fotoProfil:{uri:url}})

        }).catch((error) => {
            console.log(error);
        });
    }

    getInvoice = async () => {

        fetch('http://35.198.219.220:2121/alfaAPI/c_dashboard/getInvoice/'+this.state.email,{
            method : "GET",
            headers :{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Token' : this.state.token
            }
        })
        .then((response) => response.json())
        .then((res) => {
            const Data = res;
            const inv = Data.totalInvoice
            const invDue = Data.totalInvoiceDue
            this.setState({
                totalInvoice: inv,
                totalInvoiceDue: invDue,
                dateNow: Data.dateNow
            })
            this.setState({ refreshing: false });
        }).catch((error) => {
            console.log(error);
        });

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
                this.setState({dataTower:[]})
                    let resData = res.Data
                    this.setState({dataTower:resData},()=>{
                        this.getNews()
                    })
            }
        }).catch((error) => {
            console.log(error);
        });
    }
    getNews =() =>{
        const data = this.state.dataTower[0]
        fetch('http://35.198.219.220:2121/alfaAPI/c_newsandpromo/getDatanews2/IFCAMOBILE/'+data.entity_cd+'/'+data.project_no,{
            method : "GET",
            headers :{
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Token' : this.state.token
            }
        })
        .then((response) => response.json())
        .then((res) => {
            if(res.Error == false){
                const resData = res.Data
                this.setState({dataNews: resData })
            }    
        }).catch((error) => {
            console.log(error);
        });
    }

    onRefresh = () => {
        this.setState({ refreshing: true });
        // this.loadData()
        this.getInvoice()

    }

    handleNavigation = (screenName,passedProps) => {
        this.setState({isDisable:true},()=>{
            this.goToScreen(screenName,passedProps)
        })
    }

    goToScreen = (screenName,passedProps) => {
        Navigation.push(this.props.componentId, {
            component: {
                name: screenName,
                passProps : {
                    passed : passedProps
                }
            }
        })
    }

    componentDidDisappear(){
        this.setState({isDisable:false})
    }

    _storeData = async (name,data) =>{
        try {
            await AsyncStorage.setItem(name,data)
        } catch (error) {
            console.log('ErrorStoreData', error)
        }
    }

    render() {
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp'
        })
        const profileImageHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [PROFILE_IMAGE_MAX_HEIGHT, PROFILE_IMAGE_MIN_HEIGHT],
            extrapolate: 'clamp'
        })

        const profileImageMarginTop = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            outputRange: [HEADER_MAX_HEIGHT - (PROFILE_IMAGE_MAX_HEIGHT / 2), HEADER_MAX_HEIGHT + 5],
            extrapolate: 'clamp'
        })
        const headerZindex = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT, 120],
            outputRange: [0, 0, 1000],
            extrapolate: 'clamp'
        })

        const headerTitleBottom = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
                HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 6 + PROFILE_IMAGE_MIN_HEIGHT,
                HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT + 6 + PROFILE_IMAGE_MIN_HEIGHT
                + 16
            ],
            outputRange: [-20, -20, -20, 0],
            extrapolate: 'clamp'
        })

        const data = this.state.dataProfile;
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{ flex: 1 }}>
                    {/* <View style={{ height: this.startHeaderHeight, backgroundColor: "#37BEB7" }}>
                        <View style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            color: 'white',
                            marginVertical: 50,
                            marginHorizontal: 20,
                        }}>
                            <View>
                                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '300' }}>Welcome to IFCA 0+</Text>
                                <Text style={{ color: '#fff', fontSize: 25, fontWeight: 'bold' }}>Hai {this.state.username}</Text>
                            </View>
                        </View>
                    </View> */}
                   <Animated.View style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: '#37BEB7',
                        height: headerHeight,
                        zIndex: headerZindex,
                        elevation: headerZindex,//required for android 
                        alignItems: 'center'
                    }}>

                        <Animated.View style={{ position: 'absolute', bottom: headerTitleBottom }}>

                            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', justifyContent: 'center' }}>IFCA O+</Text>
                        </Animated.View>
                    </Animated.View>

                    <ScrollView style={{ flex: 1 }}
                        scrollEventThrottle={16}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
                        )}
                    >
                        <OfflineNotice/>

                        <Animated.View style={{
                            height: profileImageHeight,
                            width: profileImageHeight,
                            borderRadius: PROFILE_IMAGE_MAX_HEIGHT / 2,
                            borderColor: 'white',
                            borderWidth: 3,
                            overflow: 'hidden',
                            marginTop: profileImageMarginTop,
                            marginLeft: 10,

                        }}>
                            <TouchableOpacity style={{flex:1}}>
                                <Image source={this.state.fotoProfil}
                                    style={{ flex: 1, width: '100%', height: '100%' }}
                                />
                            </TouchableOpacity>
                        </Animated.View>
                        <View><Text style={{ fontWeight: '400', fontSize: 16, paddingLeft: 16 }}>Hello, {data.name}</Text></View>
                        <View style={{
                            flex: 1,
                            backgroundColor: 'white',
                            paddingTop: 32,
                        }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: '500',
                                paddingHorizontal: 16,
                            }}>
                                What Can We Help You
    
                        </Text>
                            <View style={{ height: 130, margiTop: 16,flexDirection:'row',justifyContent:'center' }}>
                                <CategoryMenu imgUrl={require
                                    ('@Asset/images/billing.png')}
                                    name="Billing" tapTo="screen.Billing"
                                    passing={this.state.totalInvoiceDue}
                                    {...this.props} />
                                <CategoryMenu imgUrl={require
                                    ('@Asset/images/helpdesk.png')}
                                    name="Helpdesk" tapTo="screen.HelpDesk"
                                    {...this.props} />
                                <CategoryMenu imgUrl={require
                                    ('@Asset/images/meterutility.png')}
                                    name="Meter" tapTo="screen.Metrix"
                                    {...this.props} />
                                <CategoryMenu imgUrl={require
                                    ('@Asset/images/overtime.png')}
                                    name="Overtime" tapTo="screen.Overtime"
                                    {...this.props} />
                            </View>
                            <View style={{ paddingHorizontal: 10 }}>
                                <Card style={{
                                    height: 110,
                                    backgroundColor: 'white',
                                    borderRadius: 10,
                                    shadowOffset: { width: 1, height: 1 },
                                    shadowColor: "#37BEB7",
                                    shadowOpacity: 0.5,
                                    elevation: 5,
                                    paddingHorizontal: 10,
                                    paddingVertical: 10
                                }}>
                                    <View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{
                                                fontSize: 18,
                                                fontWeight: '500',
                                                textAlign: 'left'
                                            }}>
                                                Invoice Due
                                        </Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'right'
                                            }}>
                                                Total Invoice
                                        </Text>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                fontWeight: '300'
                                            }}>
                                                Date {this.state.dateNow}
                                            </Text>
                                            <View style={{ right: 20 }}>
                                                <Text style={{
                                                    fontSize: 30,
                                                    fontWeight: '500',
                                                    textAlign: 'right'
                                                }}>
                                                    {this.state.totalInvoice}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <Text style={{
                                                fontSize: 18,
                                                fontWeight: '500',
                                                textAlign: 'left',
                                                color: '#F99B23'
                                            }}>
                                                Rp. {this.state.totalInvoiceDue}
                                            </Text>
                                            <View style={{ right: 8 }} pointerEvents={this.state.isDisable ? 'none' : 'auto'}>
                                                <TouchableOpacity  onPress={()=>this.handleNavigation('screen.Billing',this.state.totalInvoiceDue)}>
                                                    <Text style={{ color: '#50CAC2' }}>View All</Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                        {/* <TouchableOpacity style={{ position: 'absolute', right:20,}}>
                                        <Text>View All</Text>
                                    </TouchableOpacity> */}
                                        {/* <TouchableOpacity>
                                        <Text>19</Text>
                                    </TouchableOpacity> */}
                                    </View>
                                </Card>
                                <View style={{ marginTop: 32, paddingHorizontal: 16 }}>
                                    <Text style={{
                                        fontSize: 18,
                                        fontWeight: '500'
                                    }}>
                                        News and Information
                                </Text>
                                    <View style={{ marginTop: 20}} pointerEvents={this.state.isDisable ? 'none' : 'auto'}>
                                        {this.state.dataNews.map((data,key)=>
                                            <TouchableOpacity key={key} onPress={()=>this.handleNavigation('screen.NewsDetail',data.id)}>
                                                <News key={key} width={width} data={data} />
                                            </TouchableOpacity>
                                        )}
                                        
                                    </View>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        )
    }
}

export default Home;




const nbStyles = {
    subtitle: {
        textAlign: 'center',
        color: '#ACD2FA'
    },
    btn: {
        marginTop: 15
    }
}   
