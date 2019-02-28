import React, { Component } from "react";

import {
    Container,
    Content,
    Text,
    ListItem,
    List,
    Thumbnail,
    Body,
    Header,
    Left,
    Right,
    Icon,
    Title
} from 'native-base'
import { TouchableOpacity } from 'react-native'
import Hero from '../../components/Hero'
import axios from 'axios'
import {Navigation} from 'react-native-navigation'

class Heroes extends Component {

    //Setting Static Top Bar
    static options(passProps) {
        return {
            topBar: {
                visible:false,
                height:0
                // title:{
                //   text :"Heroes"
                // },
                // rightButtons: {
                //   id: 'btnToAdd',
                // }
              },
        };
      }

    constructor(props){
        super(props);
        this.state = {
            heroes : []
        }

        Navigation.events().bindComponent(this);
        
    }
    
    navigationButtonPressed({ buttonId }) {
        this.goToScreen('screen.HeroesAdd');
    }

    goToScreen = (screenName) => {
        Navigation.push(this.props.componentId,{
            component:{
                name : screenName
            }
        })
    }
    componentDidMount(){
        axios.get('http://rest.learncode.academy/api/hanan/heroes').then((response)=>{
            this.setState({heroes : response.data})
            console.log('Heroes', response.data)
        }).catch((error)=>{
            console.log('error', error)
        })
    }

    renderHeader(){
        return(
            <Header>
                <Left/>
                <Body>
                    <Text>Heroes2</Text>
                </Body>
                <Right>
                    <TouchableOpacity onPress={()=>this.goToScreen('screen.HeroesAdd')}>
                            <Icon name="add" style={{color : '#62AFEF'}}></Icon>
                    </TouchableOpacity>
                </Right>
            </Header>
        )
    }

    render() {
        return (
            <Container>
                {this.renderHeader()}
                <Content>
                    <List>
                        {this.state.heroes.map((hero,key)=> 
                            <Hero key={key} hero={hero} {...this.props}/> 
                        )}
                    </List>
                </Content>
            </Container>
        );
    }
}
export default Heroes;


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         alignItems: 'center',
//         justifyContent: 'center'
//     }
// });