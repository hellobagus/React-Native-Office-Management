import React, { Component } from "react";
import { Container, Content, Text, List, ListItem, Thumbnail, Body } from "native-base";
import PropTypes from 'prop-types';


class HeroesView extends Component {

    //Setting Static Top Bar
    static options(passProps) {
        return {
            topBar: {
                title:{
                  text :"Heroes"
                },
                backButton:{
                    title : ''
                },
            },
        };
    }

    constructor(props){
        super(props);

        console.log('props', props)
    }
    render() {
        const {hero} = this.props;

        return (
            <Container>
                <Content>
                    <List>
                        <ListItem>
                            <Thumbnail square size={80} source={{uri : hero.imageUri}} />
                            <Body>
                                <Text>{hero.name}</Text>
                                <Text>{hero.title}</Text>
                            </Body>
                        </ListItem>

                        <ListItem itemDivider>
                            <Text>Role</Text>
                        </ListItem>
                        <ListItem>
                            <Text>{hero.role}</Text>
                        </ListItem>

                        <ListItem itemDivider>
                            <Text>Speciality</Text>
                        </ListItem>
                        <ListItem>
                            <Text>{hero.speciality}</Text>
                        </ListItem>

                        <ListItem itemDivider>
                            <Text>Skills</Text>
                        </ListItem>
                        <ListItem>
                            <Text>...</Text>
                        </ListItem>
                    </List>
                </Content>
            </Container>
        );
    }

    
}

HeroesView.propTypes = {
    text : PropTypes.string
}

export default HeroesView;
