import React from 'react-native'

const HostSite = 'http://114.55.67.228:9090'

const ResponseStatus = {
    success: 2000,          //请求成功
    dataNotExist: 3000,     //数据不存在
    passwordError: 3001,    //密码错误
    dataExist: 3002,        //数据已存在
    paramsError: 4000,      //参数错误
    needUpdateClient: 4010, //需要升级客户端
    siteIdError: 4020,      //站点id编号错误
    otherError: 4100,       //其它原因错误
}

function post(action, params={},token,host=HostSite) {
    const fetchUrl = host + '/' + action

    let body = ''
    for (let key in params) {
        body += key + '=' + params[key] + '&'
    }
    var requestParams = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'uToken': token
        },
        body: body
    }
    return fetch(fetchUrl, requestParams)
          .then((response) => response.json())
          .catch((error)=>{console.log(error)})
}

function get(params={}, host=HostSite) {
    let fetchUrl = `${host}?`
    for (let key in params) {
        fetchUrl += key + '=' + params[key] + '&'
    }
    console.log(fetchUrl);
    const requestParams = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    }
    return fetch(fetchUrl, requestParams)
          .then((response) => response.json())
          .catch((error)=>{console.log(error)})
}

export default {
    ResponseStatus,
    HostSite,
    get,
    post,
}
