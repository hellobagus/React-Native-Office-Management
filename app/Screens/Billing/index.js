import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
} from "react-native";
import {Container, 
    Content,
    Text,
    DatePicker,Button,
} from 'native-base'
import nbStyles from './Style'
import Style from '@Theme/Style'
import SegmentedControlTab from 'react-native-segmented-control-tab'
import BillingCardList from '@Component/Billing/BillingCardList'
import numFormat from '@Component/numFormat'
import OfflineNotice from '@Component/OfflineNotice';


class Billing extends Component {
    _isMounted : false;

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
            dateNow     : new Date(),
            startDate   : '2018-09-01',
            endDate     : '2019-12-01',
            data        : [],
            selectedIndex : 0,
            jumlah      : this.props.passed
         };
    }

    componentDidMount(){
        this._isMounted=true;
        this.getBilling(0)

    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    getBilling = async (type) =>{

        const formData = {
            entity : '1500',
            project : '1501',
            name : 'syarif',
            date_start : this.state.startDate,
            date_end : this.state.endDate,
            type : type
        }


        data = JSON.stringify(formData);
        fetch('http://35.198.219.220:2121/alfaAPI/c_bill_history/getBill/IFCAPB/DEBTOR/ARHA-01',{
            method:'POST',
            headers : {
                'Accept':'application/json',
                'Content-Type' : 'application/json',
            },
            body : data
        })
        .then((response) => response.json())
        .then((res)=>{
            const Data = res;
            if(this._isMounted){
                this.setState({data : Data})
            }
            // this.setState({refreshing: false});
        }).catch((error) => {
            console.log(error);
        });
        
    }

    handleIndexChange = (index) => {
        this.setState({
          selectedIndex : index
        });

        this.getBilling(index)


        console.log('Selected index', this.state.selectedIndex)
    }

    

    render() {
        return (
           <Container>
               <OfflineNotice/>
               <Content>
                    <View style={nbStyles.wrap}>
                        <View style={nbStyles.subWrap}>
                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                                <Text style={nbStyles.title}>Billing Info</Text>
                                <Text style={nbStyles.subTitle}>Rp. {numFormat(this.state.jumlah)}</Text>
                            </View>
                        </View>
                        <View style={nbStyles.subWrap}>    
                            <SegmentedControlTab
                            values={['Due', 'Current']}
                            selectedIndex={this.state.selectedIndex}
                            onTabPress={this.handleIndexChange}
                            activeTabStyle={nbStyles.activeTabStyle}
                            activeTabTextStyle={nbStyles.activeTabTextStyle}
                            tabStyle={nbStyles.tabStyle}
                            tabTextStyle={nbStyles.tabTextStyle}
                            />
                        </View>
                        <Text style={{fontSize:12, marginLeft: 12, marginTop: 16}}>
                            Date: {this.state.dateNow.toString().substr(4, 12)}
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
                                onDateChange={this.setStartDate}
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
                                onDateChange={this.setEndDate}
                                disabled={false}
                                />
                            </View>
                        </View> */}
                        <View>
                                {this.state.data.map((data,key)=>
                                    <BillingCardList key={key} data={data} />
                                )}
                        </View>
                    </View>
                </Content>
           </Container>
        );
    }
}
export default Billing;
