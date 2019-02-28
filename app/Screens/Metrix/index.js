import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    SegmentedControlIOS,
    AsyncStorage,
    ActivityIndicator
} from "react-native";
import {Container, 
    Content,
    Text,
    DatePicker,Button, Card
} from 'native-base'
import Spinner from 'react-native-loading-spinner-overlay'
import moment from 'moment'
import nbStyles from './Style'
import Style from '@Theme/Style'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import { ListItem, Icon } from 'react-native-elements';
import OfflineNotice from '@Component/OfflineNotice';


class Metrix extends Component {

    _isMount = false;

    static options(passProps){
        return {
            topBar : {
                noBorder:true
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
            chosenDate: new Date() ,
            email : '',
            spinner : true,

            dataMeter : [],
        };
        this.setDate = this.setDate.bind(this);
    }

    setDate(newDate) {
        this.setState({ chosenDate: newDate });
    }

    async componentDidMount(){
        this._isMount = true;
        const data = {
            email : await AsyncStorage.getItem('@User'),
        } 

        this.setState(data,()=>{
            this.getTower()
        })
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
                this.getMeter(resData)
            }
        }).catch((error) => {
            console.log(error);
        });
    }

    getMeter = (data) => {
        const dT = data[0]

        const formData = {
            entity_cd : dT.entity_cd,
            project_no : dT.project_no,
            email : this.state.email
        }

        fetch('http://35.198.219.220:2121/alfaAPI/c_meter_utility/getData/IFCAPB',{
            method : "POST",
            body :JSON.stringify(formData)
        })
        .then((response) => response.json())
        .then((res)=>{
            if(res.Error === false){
                let resData = res.Data
                if(this._isMount){
                    this.setState({dataMeter : resData,spinner:false})
                }
            }
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

    render() {
        return (
           <Container>
                <OfflineNotice/>
                <Content>

                    <View style={nbStyles.wrap}>
                        <View style={nbStyles.subWrap}>
                            <View style={nbStyles.subWrap}>
                                <Text style={nbStyles.title}>Meter Utility</Text>
                            </View>
                        </View>

                        <Text style={nbStyles.subWrap}>
                            Date: {this.state.chosenDate.toString().substr(4, 12)}
                        </Text>
                        {/* <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                            <View style={{marginTop:16}}>
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
                                onDateChange={this.setDate}
                                disabled={false}
                                />
                            </View>
                            <View style={{marginTop:16}}>
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
                                onDateChange={this.setDate}
                                disabled={false}
                                />
                            </View>
                        </View> */}
                        
                        <View style={styles.listview}>
                            {
                                this.state.spinner ? 
                                    <ActivityIndicator size='large' color="#37BEB7"/>
                                :
                                
                                this.state.dataMeter.map((data,key)=>
                                <Card key ={key} style={styles.card}>
                                    <View>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <Text style={{
                                                fontSize: 18,
                                                fontWeight:'500',
                                                textAlign:'left'
                                            }}>
                                                {data.lot_no}
                                            </Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'500',
                                                textAlign:'right',
                                                color:'#9B9B9B'
                                            }}>
                                                Type Electric : {data.descs}
                                            </Text>
                                        </View>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <Text style={{
                                                fontSize: 16,
                                                fontWeight:'500',
                                                textAlign:'left',
                                                color:'#F99B23'
                                            }}>
                                                {data.name}
                                            </Text>
                                            <View>
                                                <Text style={{
                                                    fontSize: 12,
                                                    fontWeight:'500',
                                                    textAlign:'right',
                                                    color:'#9B9B9B'
                                                }}>
                                                    Meter ID : {data.meter_id}
                                                </Text>
                                            </View>
                                        </View>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'300',
                                                textAlign:'left',
                                                color:'#9B9B9B'
                                            }}>
                                                {moment(data.doc_date).format("MMM DD YYYY")}
                                            </Text>
                                        </View>
                                        <View style={{borderBottomWidth :1,borderBottomColor : '#F3F3F3', marginTop: 8}}/>
                                        <View style={{flexDirection:'row', justifyContent:'space-between' , marginTop: 8}}>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'300',
                                                textAlign:'left'
                                            }}>
                                                {data.last_read} KWH
                                            </Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'500',
                                                textAlign:'left'
                                            }}>
                                                {data.curr_read} KWH
                                            </Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'500',
                                                textAlign:'left'
                                            }}>
                                                {data.usage} KWH
                                            </Text>
                                        </View>
                                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'300',
                                                textAlign:'left',
                                                color:'#9B9B9B'
                                            }}>
                                                Previous
                                            </Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'500',
                                                textAlign:'left',
                                                marginRight:20,
                                                color:'#9B9B9B'
                                            }}>
                                                Current
                                            </Text>
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight:'500',
                                                textAlign:'left',
                                                color:'#9B9B9B'
                                            }}>
                                                Usage
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            )}
                        </View>
                    </View>                    
               </Content>
           </Container>
        );
    }
}
export default Metrix;

const styles = StyleSheet.create({
    card :{
        height:125,
        backgroundColor: 'white',
        shadowOffset : { width:1, height: 1},
        shadowColor:"#37BEB7",
        shadowOpacity:0.5,
        elevation:5,
        paddingHorizontal:10,
        paddingVertical:10,
    },  
    listview: {
        marginTop: 54
    },
    listitemm: {
        height: 100
    }
});
