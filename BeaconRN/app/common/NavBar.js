import React from 'react-native'
import NavigationBarRN from 'react-native-navbar'

import AppConfig from './AppConfig'

const {
    StyleSheet,
    Navigator,
    Component,
    Image,
    View,
    TouchableHighlight,
    Text,
} = React;

class NavBarImageButton extends Component {
    render() {
        return(
            <TouchableHighlight underlayColor='transparent' onPress={this.props.onPress} style={[styles.navBarButton, this.props.style]}>
                <Image
                    style={[styles.navBarButtonImage, this.props.imageStyle]}
                    source={this.props.image}
                />
            </TouchableHighlight>
        )
    }

}

class NavBarTextButton extends Component {
    render() {
        return(
            <TouchableHighlight underlayColor='transparent' onPress={this.props.onPress} style={[styles.navBarButton, this.props.style]}>
                <Text
                    style={[styles.navBarText, this.props.textStyle]}
                >
                    {this.props.title}
                </Text>
            </TouchableHighlight>
        )
    }

}


class NavigationBar extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        let leftButton = null

        if (this.props.leftButton) {
            leftButton = this.props.leftButton
        } else {
            if (this.props.hiddenLeftButton == true) {
                leftButton = (<View></View>)
            } else {
                leftButton = (<NavBarImageButton
                    image={require('../resources/navbar/navbar-back-black-normal.png')}
                    navigator={this.props.navigator}
                    backButtonClick={this.props.backButtonClick}
                    onPress={()=>{
                         if (this.props.backButtonClick) {
                             this.props.backButtonClick()
                         }
                         this.props.navigator.pop()
                    }}
                />)
            }
        }

        let title
        if (typeof this.props.title == 'string') {
            title = {title: this.props.title, tintColor: this.props.titleColor ? this.props.titleColor : 'black'}
        } else {
            title = this.props.title
        }

        return(
            <View style={[styles.container, {borderBottomColor: this.props.shadowColor ? this.props.shadowColor : 'rgba(210, 210, 210, 0.7)'}]}>
                <NavigationBarRN
                    title={title}
                    tintColor={this.props.tintColor}
                    leftButton={leftButton}
                    rightButton={this.props.rightButton}
                />
            </View>
        )
    }

}

var styles = StyleSheet.create({
    container: {
        width:AppConfig.ScreenWidth,
        borderBottomWidth: 0.8,
    },
    navBarButton: {
        width: 44,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -5,
    },
    navBarButtonImage: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    navBarText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },

})

export default {
    NavigationBar,
    NavBarImageButton,
    NavBarTextButton,
}
