/**
* created by schiller,
* 用处存放全局变量, 单例
*/

import React, {AsyncStorage,NativeModules} from 'react-native'
import RNCache from './common/RNCache'

var Application = (function() {
    var application;
    function getInstance(opts) {
        if (!application) {
            application = new Application(opts);
        }
        return application;
    }

    //添加全局属性
    function Application() {
        this.isLogin = false;
        this.username = '';
        this.password = '';
        this.versionName = '';
    }

    Application.prototype.getLoginStatus = function () {
        return this.isLogin;
    };

    Application.prototype.setLoginStatus = function (isLogin) {
        this.isLogin = isLogin;
    };

    Application.prototype.setUsername = function (userName) {
        this.username = userName;
    }
    Application.prototype.setPassword = function (passWord) {
        this.password = passWord;
    }

    Application.prototype.getUsername = function () {
        return this.username;
    };
    Application.prototype.getVersionName = function () {
        return this.versionName
    };

    return {
        getInstance: getInstance
    };
})();

module.exports = Application;
