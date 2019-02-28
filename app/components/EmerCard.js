import React, { Component } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";
import {Navigation} from 'react-native-navigation'
import Communications from 'react-native-communications';


class EmerCard extends Component {

    // componentDidMount(){
    // }

    // constructor(props){
    //     super(props);

    //     this.state = {
    //         isDisable : false,
    //         linkTo : 'Comunications.phonecall('0193103184')'
    //     }

    //     Navigation.events().bindComponent(this);
        
    // }

    // componentWillMount(){
    //     let link = this.props.tapTo
    //     if(link){
    //         this.setState({linkTo:link})
    //     }
    // }

    // goToScreen = (screenName) => {
    //     Navigation.push(this.props.componentId,{
    //         component:{
    //             name : screenName
    //         }
    //     })
    // }
    render() {
        
        return (
            <TouchableOpacity style={nbStyles.btnBox} onPress={() => Communications.phonecall('0857764692323', true)}>
                <Image source={this.props.imgUrl} style={nbStyles.btnImage}/>
                <Text style={nbStyles.btnText}>{this.props.text}</Text>
            </TouchableOpacity>
        );
    }
}
export default EmerCard;

const nbStyles = {
    btnBox: {
        paddingHorizontal :20,
        paddingVertical :20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F4F5',
        borderRadius: 5,
        width: '40%',
        borderColor: '#91D5D1',
        borderWidth: 1
    },
    btnImage : {
        height : 50,
        width : 50,
        marginBottom : 10
    },
};