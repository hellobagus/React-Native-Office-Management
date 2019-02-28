// Note : ini semua masih hardcode
import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Button
} from "react-native";
import {Container, Content, Text, H2, Icon, Subtitle} from 'native-base'
import nbStyles from './Style'
import {Navigation} from 'react-native-navigation'
import Title from '@Component/Title'
import SubTitle from '@Component/SubTitle'
import EmerCard from '@Component/EmerCard'
import Communications from 'react-native-communications';
import OfflineNotice from '@Component/OfflineNotice';


class Emergency extends Component {
   

    static options(passProps){
        return {
            topBar : {
                noBorder:true,
                height : 0
            },
            // bottomTabs :{
            //     visible : false,
            //     drawBehind: true, 
            //     animate: true
            // }
        }
    }

    constructor(props){
        super(props);

        Navigation.events().bindComponent(this);
        
    }

    goToScreen = (screenName) => {
        Navigation.push(this.props.componentId,{
            component:{
                name : screenName
            }
        })
    }
    render() {
        return (
            <Container>
                <OfflineNotice/>
                <Content>
                    <View style={nbStyles.wrap}>

                        <Title style={nbStyles.title} text="Emergency Contact"/>
                        {/* Start Menu Kotak Kotak */}
                        <View style={nbStyles.menuWrap}> 
                            <View  style={nbStyles.btnLayout}>
                                <EmerCard imgUrl={require('@Asset/images/call.png')} 
                                text="Service"
                                // tapTo="screen.SpecHelpDesk"
                                {...this.props}/>
                                <EmerCard imgUrl={require('@Asset/images/policecar.png')} 
                                text="Police"
                                {...this.props}/>
                            </View>
                            <View  style={nbStyles.btnLayout}>
                                <EmerCard imgUrl={require('@Asset/images/firetruck.png')} 
                                text="Firefighters"
                                {...this.props}/>
                                
                                <EmerCard imgUrl={require('@Asset/images/ambulance.png')} 
                                text="Ambulance"
                                {...this.props}/>
                            </View>
                            <View  style={nbStyles.btnLayout}>
                                <EmerCard imgUrl={require('@Asset/images/sheriff.png')} 
                                text="Security"
                                {...this.props}/>
                                
                                <EmerCard imgUrl={require('@Asset/images/helmet.png')} 
                                text="Engineering"
                                {...this.props}/>
                            </View>
                        </View>
                        {/* END MENU KOTAK KOTAK */}
                    </View>
                </Content>
            </Container>
        );
    }
}
export default Emergency;
