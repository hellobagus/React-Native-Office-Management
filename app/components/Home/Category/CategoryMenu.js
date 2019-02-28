import React, { Component } from 'react'
import { 
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native'
import {Navigation} from 'react-native-navigation'
import Spinner from 'react-native-loading-spinner-overlay'
import TouchableDebounce from '@Component/TouchableDebounce/'


class CategoryMenu extends Component {

    constructor(props){
        super(props);

        this.state = {
            isDisable : false,
            linkTo : 'screen.ZonkScreen',
            passing : '',

            isDisable : false
        }

        Navigation.events().bindComponent(this);        
    }

    componentWillMount(){
        let link = this.props.tapTo
        let passing = this.props.passing
        if(link){
            this.setState({linkTo:link,passing : passing})
        }


    }

    handleNavigation =(data) =>{
        this.setState({isDisable:true},()=>{
            this.goToScreen(data);
        })
    }

    goToScreen = (screenName) => {
        

        Navigation.push(this.props.componentId,{
            component:{
                name : screenName,
                passProps : {
                    passed : this.props.passing
                }
            }
        })
    }

    componentDidDisappear(){
        this.setState({isDisable:false})        
    }
    render() {
        return (
            <View pointerEvents={this.state.isDisable ? 'none' : 'auto'}>
                <TouchableOpacity style={nbStyles.btnBox} onPress={()=>this.handleNavigation(this.state.linkTo)}>
                    <Image source={this.props.imgUrl} style={nbStyles.btnImage}/>
                    <Text style={nbStyles.btnText}>{this.props.name}</Text>
                </TouchableOpacity>
                
            </View>
        );
    }
}

export default CategoryMenu;

const nbStyles = {
    btnBox: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal : 13
    },
    btnImage : {
        height : 75,
        width : 75,
        marginBottom : 10
    },
};

