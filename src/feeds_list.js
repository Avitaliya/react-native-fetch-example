import React, { Component } from 'react';
import { Image, StyleSheet, View, FlatList, TouchableOpacity, Modal, ToastAndroid, Share, ActivityIndicator } from 'react-native';
import { Content, Card, CardItem, Text, Textarea, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import ImagePicker from 'react-native-image-picker';

export default class feeds_list extends Component {

    static navigationOptions = ({navigation}) => {

        return {
            title: 'Feeds',
            headerRight: <TouchableOpacity style={{paddingHorizontal: 15,backgroundColor: 'transfernt'}}
                onPress={ () => navigation.navigate('new_feed')} >
                <Icon name="plus" size={20}/>
            </TouchableOpacity>

        };
    };

    constructor(props){
        super(props);
        this.state = {
            DataList: '',
            ModalFeedId: '',
            DeleteModalVisible: false,
            EditModalVisible: false,
            ImageUri : require('./assets/images/placeholder_img.png'),
            FeedDesc: '',
            ImageUpload: false,
            isLoading: true,
        };
    }

    componentWillMount() {

        fetch('http://192.168.0.21/Web/index.php/Controller')
            .then((response) => response.json())
            .then((responseJson) => {
                let feeds_Array = [];
                for (let i=0; i < responseJson.length; i++)
                {
                    feeds_Array.push(responseJson[i]);
                }
                this.setState({
                    DataList: feeds_Array,
                    isLoading: false,
                });
            })
            .catch((error) =>{
                console.error(error);
            });
    }

    selectPic() {
        const option = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };
        ImagePicker.showImagePicker(option, (response) => {
            if(response.didCancel){
                console.log('User cancelled selection');
            }
            else if (response.error) {
                console.log('Image Picker Error : ', response.error);
            }
            else if (response.customButton) {
                console.log('Custom Button Tapped: ', response.customButton);
            }else{
                let source = {uri: response.uri};
                this.setState({ImageUri: source, ImageUpload: response.uri });
            }
        })
    }



    render() {

        return (
            <View style={styles.Container}>

                <Content>

                    <FlatList
                        data= {this.state.DataList}
                        extraData={ this.state }
                        renderItem={({item}) =>
                            <Card>
                                <TouchableOpacity activeOpacity={1} onPress={() => this.props.navigation.navigate('Comment', {id:item.feedId})}>
                                    
                                        <Image source={{uri: item.image}} style={{height: 200, width: '100%'}}/>
                                </TouchableOpacity>

                                <View style={{flexDirection:'column', padding: 10}}>

                                    <View style={{paddingVertical:5}}>
                                        <Text>{ item.feed_desc }</Text>
                                    </View>

                                    <View style={styles.CardBottomArea}>

                                        <View style={styles.LikeBlock}>

                                            <TouchableOpacity onPress={() => this.FeedLike(item.feedId)} style={{flexDirection:'row', alignItems:'center'}}>

                                            <Icon name="heart" size={12} style={item.feed_like === 'Unlike' ? {color: '#FF0000',} : {color: '#808080'}} />

                                                <Text style={item.feed_like === 'Unlike' ? styles.LikeTextRed : styles.LikeText}>Like</Text>

                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.CommentBlock}>
                                            <Icon name="comments" size={15} />
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Comment', {id:item.feedId})}>
                                                <Text style={styles.CommentText}>Comment</Text>
                                            </TouchableOpacity>
                                        </View>
                                        <View style={styles.MenuBlock}>
                                            <TouchableOpacity>
                                                <Icon name="ellipsis-h" size={20} />
                                            </TouchableOpacity>
                                        </View>

                                    </View>
                                </View>
                            </Card>}
                    />

                </Content>

                {/*screnn Loading Image*/}

                <Modal
                    visible={this.state.isLoading}
                    transparent={true}
                    animationType={"fade"}
                    onRequestClose={ () => { this.setState({isLoading: false }) } } >

                    <View style={{ flex:1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', opacity: 0.3, }}>


                        <ActivityIndicator size="large" color="#0000ff" />

                    </View>

                </Modal>

            </View>

        );
    }

    FeedLike(id) {

        alert('FeedLike');

    }

}


const styles = StyleSheet.create({

    Container: {
        flex: 1,
        alignItems: 'center',
    },
    CardBottomArea: {
        flexDirection: 'row',
        width: '100%',
    },
    LikeBlock: {
        width: '40%',
        alignItems:'center',
        flexDirection: 'row',
    },
    LikeText: {
        paddingHorizontal: 5,
        fontSize: 14,
        color:'#808080'
    },
    LikeTextRed: {
        paddingHorizontal: 5,
        fontSize: 14,
        color:'#808080'
    },
    CommentBlock: {
        width: '40%',
        alignItems:'center',
        flexDirection: 'row',
    },
    CommentText: {
        paddingHorizontal: 5,
        fontSize: 14,
        color:'#808080'
    },
    MenuBlock: {
        width: '20%',
        alignItems:'center',
        justifyContent:'center',
        flexDirection: 'row',
    },

});