import React, { Component } from "react";
import {
    Container, Content, Text, Form, Item, Label, Input, Header, Left, Body, Right, 
} from 'native-base'
import {TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';

import {Navigation} from 'react-native-navigation'
import axios from "axios";

class HeroesAdd extends Component {

    static options(passProps) {
        return{
            topBar: {
                visible :false,
                height:0                
                // backButton:{
                //     title: '', // iOS only
                //     titleVisible: false // iOS only
                // },
                // rightButtons: {
                //     id: 'btnSave',
                //     icon: require('../../../img/Edit.png'),
                //     enabled : false 
                // }
            },
            bottomTabs:{
                visible :false
            }
        }
    }

    constructor(props){
        super(props);

        this.state = {
            name : '',
            title : '',
            role : '',
            speciality : '',
            imageUri:'https://cdn1.iconfinder.com/data/icons/essentials-thick-lines/128/block-disable-unavailable-512.png',

            isEnableSave : false
        }

        Navigation.events().bindComponent(this);
    }

    navigationButtonPressed({ buttonId }) {
        const {name,title,role,speciality,imageUri} = this.state;

        if(name != "" && title!=""){
            this.handleDone();
        } else {
            alert('Harus Isi')
        }
    }

    handleDone = () => {
        
        axios({
            method : 'POST',
            url:'http://rest.learncode.academy/api/hanan/heroes',
            data:this.state,
        }).then(()=>{
            Navigation.pop(this.props.componentId);
        })

    }

    renderHeader(){
        return(
            <Header>
                <Left>
                    <TouchableOpacity onPress={()=>Navigation.pop(this.props.componentId)}>
                        <Icon name="angle-left" size={30} style={{color : '#62AFEF'}}></Icon>
                    </TouchableOpacity>
                </Left>
                <Body>
                    <Text>Heroes Entry</Text>
                </Body>
                <Right>
                    <TouchableOpacity onPress={()=>this.handleDone()}>
                        <Icon name="save" size={20} style={{color : '#62AFEF'}}></Icon>
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
                    <Form>
                        <Item floatingLabel>
                            <Label>Heroues Name</Label>
                            <Input
                            onChangeText={(text)=> this.setState({name : text})}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Heroues Title</Label>
                            <Input
                            onChangeText={(text)=> this.setState({title : text})}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Role</Label>
                            <Input
                            onChangeText={(text)=> this.setState({role : text})}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Speciality</Label>
                            <Input
                            onChangeText={(text)=> this.setState({speciality : text})}
                            />
                        </Item>
                        <Item floatingLabel>
                            <Label>Image Uri</Label>
                            <Input
                            onChangeText={(text)=> this.setState({imageUri : text})}
                            />
                        </Item>
                    </Form>
                </Content>
            </Container>
        );
    }
}
export default HeroesAdd;
