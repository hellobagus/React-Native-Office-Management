// Note : ini semua masih hardcode
import React, { Component } from "react";
import { 
    View,
    StyleSheet,
    TouchableOpacity,
    Image
} from "react-native";
import {Container, Content, Text, H2, Icon, Subtitle} from 'native-base'
import nbStyles from './Style'
import {Navigation} from 'react-native-navigation'
import Title from '@Component/Title'
import SubTitle from '@Component/SubTitle'
import ButtonMenuGrid from '@Component/ButtonMenuGrid'
import OfflineNotice from '@Component/OfflineNotice';

let listener;

class HelpDesk extends Component {

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

        Navigation.events().bindComponent(this);
        // listener = Navigation.events().registerBottomTabSelectedListener(({ selectedTabIndex, unselectedTabIndex }) => {this.bottomTabSelected(selectedTabIndex, unselectedTabIndex)});
    }

    // componentWillUnmount(){
    //     listener.remove();
    // }

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
                        <Title text="Help Desk"/>
                        <SubTitle text="What we can help you"/>
                        {/* Start Menu Kotak Kotak */}
                        <View style={nbStyles.menuWrap}> 
                            <View  style={nbStyles.btnLayout}>
                                <ButtonMenuGrid imgUrl={require('@Asset/images/tiket.png')} 
                                text="New Ticket"
                                tapTo="screen.SpecHelpDesk"
                                {...this.props}/>
                                <ButtonMenuGrid imgUrl={require('@Asset/images/status.png')} 
                                text="Status"
                                tapTo="screen.StatusHelp"
                                {...this.props}/>
                            </View>
                            <View  style={nbStyles.btnLayout}>
                                <ButtonMenuGrid imgUrl={require('@Asset/images/history.png')} 
                                text="History"
                                tapTo="screen.HistoryHelp"
                                {...this.props}/>
                                {/* Note : btn Box Kosong Adalah Touch Opacity yang warnanya
                                 disamarkan dengan warna background, Silahkan Cek di Style  */}
                                <TouchableOpacity style={nbStyles.btnBoxKosong}>
                                    <Image style={nbStyles.btnImage}/>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* END MENU KOTAK KOTAK */}
                    </View>
                </Content>
            </Container>
        );
    }
}
export default HelpDesk;
