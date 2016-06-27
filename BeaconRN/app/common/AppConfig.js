import React from 'react-native'

const {
    Dimensions,
    Platform,
    PixelRatio,
} = React

const ScreenWidth = Dimensions.get('window').width
const ScreenHeight = Dimensions.get('window').height

// 定义设备像素密度和设计稿的像素密度, 以及具体使用时的缩放因子
const PR = PixelRatio.get() //设备的像素密度
const DPR = 3 // 设计稿的像素密度
const DSH = (1242/3) // 设计稿的点宽度
const ScaleFactor = ((ScreenWidth/DSH)/DPR)
const ScreenScale = ScreenWidth/375.0

let TopMargin = 0
let BottomMargin = 49

let NavBarHeight = 44
let StatusBarHeight = 20
if(Platform.OS==='android'){
    StatusBarHeight = 0
    TopMargin = 22
    BottomMargin = 0
}

// 包含了导航和状态栏的高度
const NavHeight = NavBarHeight + StatusBarHeight;

// 定义页面颜色
const PageBgColor = '#f7f7f7'
const TabBarTintColor = '#46c6d3'
const NavBarTintColor = '#f8f8f8'

// 定义开发环境 0:开发环境  1:发布环境
let ENV = 1

//登录或用户来源
const TWSNSPlatformWeiXin = 1
const TWSNSPlatformQQ = 2
const TWSNSPlatformWeibo = 3
const TWSNSPlatformTaobao = 4

//移动端系统类型
const OsTypeiOS = 0
const OsTypeAndroid = 1
const OsTypeWeb = 2
const OsTypeWP = 3
const OsTypeOther = 4

//服务器版本要求(网络接口环境)
const CQSericeVersion = '2.0'

// 保存用户相关信息
const UserInfoKey = 'UserInfoKey'

export default {
    ENV,
    ScreenWidth,
    ScreenHeight,
    NavHeight,
    NavBarHeight,
    StatusBarHeight,
    PageBgColor,
    PR,
    DPR,
    ScaleFactor,
    ScreenScale,
    BottomMargin,
    TopMargin,
    TWSNSPlatformWeiXin,
    TWSNSPlatformQQ,
    TWSNSPlatformWeibo,
    TWSNSPlatformTaobao,
    OsTypeiOS,
    OsTypeAndroid,
    OsTypeWeb,
    OsTypeWP,
    OsTypeOther,
    CQSericeVersion,
    TabBarTintColor,
    NavBarTintColor,
    UserInfoKey,
}
