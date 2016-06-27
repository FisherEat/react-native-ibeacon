import React, { Component } from 'react';
import {View, Text, StyleSheet, Image, TextInput,TouchableHighlight, Alert} from "react-native";
import {Actions} from "react-native-router-flux";
import AppConfig from '../common/AppConfig'
import URLRequest from '../common/URLRequest'
import app from '../Application'
import RNCache from '../common/RNCache'

var dismissKeyboard = require('dismissKeyboard');

class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: app.getInstance().username ? app.getInstance().username : '',
            password: app.getInstance().password ? app.getInstance().password : '',
            isLogin: app.getInstance().isLogin,
            loading: false,
        }
    }

    componentDidMount() {
        let cache = new RNCache()
        cache.find(AppConfig.UserInfoKey).then((result) => {
            if (result) {
                this.setState({
                    name: result.userName,
                    password: result.password,
                })
            }
        })
    }

    login() {
        dismissKeyboard();

        if (this.state.name.length > 0) {
            if (this.state.password.length > 0) {
                var params = {
                    username: this.state.name,
                    password: this.state.password
                }

                app.getInstance().username = this.state.name;
                app.getInstance().password = this.state.password;

                URLRequest.post('/user/login', params).then((response) => {
                    console.log(response);
                    if (response) {
                        const userInfo = {
                            uToken: response.data.uToken,
                            hospitalName: response.data.hospitalName,
                            admin: response.data.userName,
                            userName: this.state.name,
                            password: this.state.password,
                        }
                        let cache = new RNCache()
                        cache.save(AppConfig.UserInfoKey, userInfo)
                        app.getInstance().loginStatus = true;

                        if (this.props.loginSuccess) {
                            this.props.loginSuccess()
                        }
                        this.pushToHome()
                    } else {
                        this.showAlertView('登录失败');
                    }
                })
            }else {
                this.showAlertView('用户名不能为空');
            }
        }else {
            this.showAlertView('密码不能为空');
        }
    }

    pushToHome() {
        if (!this.state.name || !this.state.password) {
            this.showAlertView("请重新输入用户名和密码")
            return
        }
        Actions.pop({data:"登陆成功", title:"首页" })
    }

    showAlertView(msg) {
        Alert.alert(
            '温馨提示',
            msg,
            [
                {text: '确定', onPress:() => console.log('Foo press')}
            ]
        )
    }

    render () {
        return (
            <View style={[styles.container, this.props.style]}>
                <View style={styles.logo}>
                    <Image source={require("../resources/hospital.png")} style={styles.hImg}/>
                    <Text style={styles.hText}>i H o s p i t a l</Text>
                </View>
                <Text style={styles.welcome}>欢       迎</Text>
                <View style={styles.inputview}>
                    <TextInput
                        style={styles.textinput}
                        placeholder="账号"
                        clearButtonMode="while-editing"
                        numberOfLines={1}
                        atouFocus={true}
                        value={this.state.name}
                        onChangeText={(val)=>{this.setState({name: val})}}>
                    </TextInput>
                    <View style={styles.line}></View>
                    <TextInput
                        style={[styles.textinput]}
                        password={true}
                        clearButtonMode="while-editing"
                        placeholder="密码"
                        returnKeyType="go"
                        value={this.state.password}
                        keyboardType="email-address"
                        numberOfLines={1}
                        atouFocus={true}
                        onChangeText={(val)=>{this.setState({password: val})}}>
                    </TextInput>
                </View>
                <TouchableHighlight
                    style={styles.loginBtn}
                    onPress={Actions.pop}
                    underlayColor='#064F4D'
                    onPress={()=>{this.login()}}
                >
                    <Text style={{fontSize: 18, color: '#fff'}}>登 录</Text>
                </TouchableHighlight>
            </View>
        )
    }
}
var styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#f5f6f7",
    },
    logo: {
        marginTop: 65,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection:'row'
    },
    hImg: {
        width: 38*AppConfig.ScreenScale,
        height: 38*AppConfig.ScreenScale
    },
    hText: {
        marginLeft: 15,
        color:'#5b5a5a',
        fontSize: 24,
        fontWeight: '500',
    },
    welcome: {
        marginTop: 30,
        textAlign: 'center',
        fontSize: 24,
        color: '#5b5a5a'
    },
    inputview: {
        backgroundColor: '#fff',
        alignItems:'center',
        alignSelf: 'stretch',
        marginTop: 40,
        marginLeft: 45 * AppConfig.ScreenScale,
        marginRight: 45 * AppConfig.ScreenScale,
        height: 103,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#cfd0d1'
    },
    line: {
        height: 1,
        alignItems: 'center',
        marginLeft: 1,
        marginRight: 1,
         width: 250 * AppConfig.ScreenScale,
        backgroundColor: '#cfd0d1',
    },
    textinput: {
        height: 50,
        marginLeft: 20,
        marginRight: 10,
        alignItems: 'center',
        backgroundColor: '#fff',
        fontSize: 14,
    },
    loginBtn: {
        marginLeft: 45,
        marginRight: 45,
        alignSelf: 'stretch',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 30,
        borderRadius: 25,
        height: 50,
        backgroundColor: '#129793'
    }
});

export default Login;
