import React from 'react';
import {DeviceEventEmitter,View, Image,Text,AlertIOS , StyleSheet, TouchableHighlight, NativeModules} from "react-native";
import {Actions} from "react-native-router-flux";
import AppConfig from '../common/AppConfig'
import URLRequest from '../common/URLRequest'
import Login from '../user/Login'
import RNCache from '../common/RNCache'
import Springboard from '../common/Springboard'

var Ratio = AppConfig.ScreenScale;

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            statusMsg: '',
            locationMsg: '',
            connected: false,
            uToken: null,
        }
    }

    componentDidMount() {
        this.readCache();
        this.startMonitor()
    }

    loginSuccess() {
        // 在这里重新设置一下uToken的值，刷新一下界面
        this.readCache();
        this.startMonitor();
    }

    readCache() {
        (new RNCache()).find(AppConfig.UserInfoKey).then((result) => {
            if (result) {
                this.setState({
                    uToken: result.uToken,
                })
            }else {
                Actions.login({loginSuccess: this.loginSuccess.bind(this)})
            }
        })
    }
    //开始监测beacon
    startMonitor() {
        var _ = this;
        Springboard.startMonitor(function(callback) {
            _.setState({
                statusMsg: '正在发送当前位置...',
                connected: false
            })
            console.log(_.state.statusMsg)
        })

        DeviceEventEmitter.addListener('refreshData', (response)=>{
            let params = response;
            let distance;
            let nearestBeacon;
           
            if (params.beacons.length > 0) {
                nearestBeacon = params.beacons[0];
                distance = (nearestBeacon.distance > 30.0 || nearestBeacon.distance < 0) ? "距离未知" : ('您距离最近的基站'+nearestBeacon.distance.toFixed(2)+'米');
                _.setState({
                statusMsg:!nearestBeacon.uuid ? '正在发送当前位置...' : '连接成功',
                locationMsg: !nearestBeacon.uuid ? '' : distance,
                connected: true,
                });
            }else {
                _.setState({
                    statusMsg: '未连接',
                    locationMsg: '',
                    connected: false
                });
            }

            if (this.state.uToken) {
                // alert(Object.entries(params));
                // alert(Object.entries(params.beacons[0]));
                URLRequest.post('beacon/uploadLocation', params, this.state.uToken).then((response)=>{
                   // console.log(response);
                   // alert(Object.entries(response));
                });
            }
        });
    }

    //退出登录
    logout() {
    // 退出登录的时候，选把uToken清掉，不再上传位置信息
        this.setState({uToken: null});
        Springboard.stopMonitor(function(callback) {
            console.log('stop monitor');
        });
        Actions.login({loginSuccess: this.loginSuccess.bind(this)});
    }

    render () {
        return (
            <View style={styles.container}>
                <Image
                    source={require('../resources/home_bgview.png')}
                    style={styles.bgImg}
                >
                    <View style={{marginTop: 35, alignItems: 'center', width: AppConfig.ScreenWidth,height: 400 * Ratio, backgroundColor: 'transparent'}}>
                        <Image source={require('../resources/circle_large.png')} style={{alignItems:'center', justifyContent:'center',width:400*Ratio, height: 400*Ratio}}>
                            <Image
                                source={require('../resources/circle_medium.png')}    style={{alignItems:'center', justifyContent:'center',width:290*Ratio, height: 290*Ratio}}>
                                <Image
                                    source={require('../resources/circle_small.png')}
                                    style={{alignItems: 'center',justifyContent: 'center', width: 160*Ratio, height: 160*Ratio}}>
                                    <Image
                                        source={require('../resources/dot.png')}
                                        style={{alignItems: 'center',
                                       justifyContent: 'center', width: 10*Ratio, height: 10*Ratio}} />
                                </Image>
                            </Image>
                        </Image>
                    </View>
                    <Text style={[styles.statusText, !this.state.locationMsg ? {marginTop: 30}: {marginTop: 20}]}>
                        {this.state.statusMsg}
                    </Text>
                    <Text style = {styles.locationText}>
                        {this.state.locationMsg}
                    </Text>
                    <TouchableHighlight
                        style={styles.logoutBtn}
                        onPress={Actions.pop}
                        underlayColor='rgba(220, 220, 220, 0.7)'
                        onPress={()=>{this.logout()}}
                    >
                        <Text style={{fontSize: 15, color: '#9a9a9a'}}>退出登录</Text>
                   </TouchableHighlight>
              </Image>
            </View>
        )
    }
}

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    bgImg: {
        flex: 1,
        width: AppConfig.ScreenWidth,
        height:AppConfig.ScreenHeight,
        alignItems: 'center',
        justifyContent: 'center'
    },
    statusText: {
        marginTop: 20,
        backgroundColor: 'transparent',
        fontSize: 15,
        color: '#fff',
        alignItems:'center'
    },
    locationText: {
        marginTop: 10,
        backgroundColor: 'transparent',
        fontSize: 15,
        color: '#fff',
        alignItems: 'center',
    },
    logoutBtn: {
        marginTop: 30,
        alignItems: 'center',
        justifyContent: 'center',
        width: 210*Ratio,
        height: 40,
        borderRadius: 25,
        backgroundColor: '#fff'
    },
    logoutText: {
        color: '#9a9a9a',
        fontSize: 15
    }
});

export default Home;
