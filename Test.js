import React from 'react'
import { View, Text } from 'react-native'

export default class test extends React.Component {


    constructor(props)
    {
        super(props);
        this.state={
            desc: 'Hey!',
        }

        fetch('https://facebook.github.io/react-native/movies.json')
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson);

            })
            .catch((error) =>{
                console.log(error);
            });

    }


    render(){

        return(
            <View>

                <Text>This is test Screen : {this.state.desc}</Text>

            </View>
        );

    }
}