import React,{ Component } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ToastAndroid, ActivityIndicator, Modal } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Textarea, Button } from 'native-base';
import { NavigationActions, StackActions } from 'react-navigation';

export default class new_feed extends Component<prop> {

    static navigationOptions = {
        title: 'New Feed',
    };

    constructor() {
        super();
        this.state = {
            ImageUri : require('./assets/images/placeholder_img.png'),
            FeedDesc: '',
            ImageUpload: false,
            isLoading: false,
        }
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

        return(
            <View style={styles.container}>

                <View style={styles.ImageBlock}>

                    <TouchableOpacity onPress={this.selectPic.bind(this)} >
                        <Image source={this.state.ImageUri} style={styles.FeedImage}/>
                    </TouchableOpacity>

                </View>

                <View style={styles.MainBlock}>

                    <Textarea rowSpan={5} bordered placeholder="Feed Description..." style={styles.Textarea} onChangeText={(text) => this.setState({FeedDesc: text})}/>

                    <View style={styles.ButtonArea}>

                        <Button full rounded style={styles.Button} onPress={() => this.doUpload()}>
                            <Text style={styles.ButtonLabel}>Submit</Text>
                        </Button>

                    </View>

                </View>

                <Text>{this.state.FeedDesc}</Text>

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

    doUpload() {

        if (this.state.ImageUpload === false){
            ToastAndroid.show('Please upload Image !', ToastAndroid.SHORT);
        }
        else if (this.state.FeedDesc === ''){
            ToastAndroid.show('Enter Feed Description !', ToastAndroid.SHORT);
        }
        else {
            this.setState({isLoading: true })
            var data = new FormData();
            data.append('file', {uri: this.state.ImageUpload, name: 'image.jpg', type: 'image/jpg'});
            data.append('feed_desc', this.state.FeedDesc);

            const config = {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                    'Authorization': 'Bearer ' + 'SECRET_OAUTH2_TOKEN_IF_AUTH',
                },
                body: data,
            }

            fetch("http://192.168.0.21/Web/index.php/Controller/upload", config)
                .then((response) => response.json())
                .then((response) => {

                    if(response.status === 200){
                        this.setState({isLoading: false })
                        ToastAndroid.show('New Feed Inserted...!', ToastAndroid.SHORT);
                        const resetAction = StackActions.reset({
                            index: 0,
                            actions: [NavigationActions.navigate({ routeName: 'feeds_list' })],
                        });
                        this.props.navigation.dispatch(resetAction);

                    }else{
                        this.setState({isLoading: false })
                        ToastAndroid.show(response.message, ToastAndroid.SHORT);
                    }

                })
                .catch(err => {
                    console.log('error : ', err);
                })
        }

    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    ImageBlock: {
        paddingVertical: 10,
        width: '95%',
    },
    FeedImage: {
        width: '100%',
        height: 160,
        borderRadius: 3,
    },
    MainBlock: {
        width: '95%',
    },
    Textarea: {
        borderRadius: 3,
    },
    ButtonArea: {
        paddingVertical: 10
    },
    Button: {
        backgroundColor: '#2EBF89',
    },
    ButtonLabel: {
        color: '#FFFFFF',
    }

});