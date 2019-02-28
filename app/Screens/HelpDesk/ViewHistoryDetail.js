import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TextInput,
    Dimensions
} from "react-native";
import { Container, Content, Card } from "native-base";
import nbStyles from './Style'
import Style from '@Theme/Style'
import OfflineNotice from '@Component/OfflineNotice';


class ViewHistoryDetail extends Component {
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
    render() {
        console.log('datas', this.props.dataTicket)
        const deviceWidth = Dimensions.get('window').width;
        const data = this.props.dataTicket[0];
        const wrapStyle = {
            justifyContent:'space-between',flexDirection:'row',
            marginTop : 10
        }
        const widthStyle = {
            width : ( deviceWidth * 2 / 5)
        }

        const borderBottomColor ={
            borderWidth:1,
            borderBottomColor:'#f3f3f3',
            borderTopColor:'transparent',
            borderRightColor:'transparent',
            borderLeftColor:'transparent',
            }
        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    <Card>

                    <View style={{margin:5}}>
                        <View style={borderBottomColor}>
                            <Text>Status</Text>
                            <Text>{data.status == "R" ? "Open":
                            data.status == "A" || data.status == "S" || data.status == "M" || data.status == "P" || data.status == "F" || data.status == "Z"  ? "On Progress":
                            data.status == "C" ? "Completed":
                            data.status == "D" ? "Done" :
                            ""
                            }</Text>
                        </View>
                        <View style={borderBottomColor}>
                            <View style={wrapStyle}>
                                <View style={widthStyle}>
                                    <Text>Reported Date :</Text>
                                    <Text>{data.reported_date}</Text>
                                </View>
                                <View style={widthStyle}>
                                    <Text>Serve by :</Text>
                                    <Text>{data.serv_req_by}</Text>
                                </View>
                            </View>
                            <View style={wrapStyle}>
                                <View style={widthStyle}>
                                    <Text>Lot no :</Text>
                                    <Text>{data.lot_no}</Text>
                                </View>
                                <View style={widthStyle}>
                                    <Text>Complain Type :</Text>
                                    <Text>{data.complain_type == "C" ? "Complain" : "Request"}</Text>
                                </View>
                            </View>
                           
                            <View style={wrapStyle}>
                                <View style={widthStyle}>
                                    <Text>Category :</Text>
                                    <Text>{data.descs}</Text>
                                </View>
                                <View style={widthStyle}>
                                    <Text>Description :</Text>
                                    <Text>{data.work_requested}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={borderBottomColor}>
                            <Text>No Complain :</Text>
                            <Text># {data.complain_no}</Text>
                        </View>
                    </View>
                    </Card>

                </Content>
            </Container>
        );
    }
}
export default ViewHistoryDetail;
