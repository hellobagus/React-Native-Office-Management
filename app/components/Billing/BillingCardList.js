import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet
} from "react-native";
import {Card} from 'native-base'
import numFormat from '@Component/numFormat'

class BillingCardList extends Component {

    constructor(props){
        super(props);
        const data = props.data
        // this.state = {
        //     tower   : data.tower,
        //     amt     : data.mdoc_amt,
        //     debtor  : data.name,
        //     date    : data.doc_date.toString().substr(0, 10)
        // }


    }
    render() {
        
        const {tower,mdoc_amt,name,doc_date,due_date, descs} = this.props.data
        return (
            <Card style={{
                backgroundColor: 'white',
                shadowOffset : { width:1, height: 1},
                shadowColor:"#37BEB7",
                shadowOpacity:0.5,
                elevation:5,
                paddingHorizontal:10,
            }}>
                <View style={{paddingVertical:10}}>
                    <View style={{paddingBottom:10,flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={{
                            fontSize: 12,
                            textAlign:'left',
                            color:'#909090'
                        }}>
                            {tower}
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            fontWeight:'500',
                            textAlign:'right',
                            color : '#F99B24'
                        }}>
                            Rp. {numFormat(mdoc_amt)}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                        <Text style={{
                            fontSize: 12,
                            fontWeight:'500',
                            textAlign:'left',
                            color:'#575757'
                        }}>
                            {name}
                        </Text>
                        </View>
                        <View style={{flexDirection:'row', justifyContent:'space-between'}}>

                        <Text style={{
                            fontSize: 12,
                            fontWeight:'200',
                            textAlign:'right',
                            color:'#9B9B9B'
                        }}>
                            Doc Date {doc_date.toString().substr(0, 10)}
                        </Text>
                        <Text style={{
                            fontSize: 12,
                            fontWeight:'200',
                            textAlign:'right',
                            color:'#9B9B9B'
                        }}>
                           Due Date {due_date.toString().substr(0, 10)}
                        </Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'center'}}>
                    <Text style={{
                            fontSize: 12,
                            fontWeight:'500',
                            textAlign:'left',
                            color:'#575757',
                            marginVertical: 10
                        }}>
                            {descs}

                    </Text>

                    </View>
                </View>
            </Card>
        );
    }
}
export default BillingCardList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});