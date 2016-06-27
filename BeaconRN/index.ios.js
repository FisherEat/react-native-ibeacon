/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View } from 'react-native';
import {Scene, Reducer, Router, Switch, TabBar, Modal, Schema, Actions} from 'react-native-router-flux';
import CodePush from 'react-native-code-push';
import Home from './app/beacon/Home'
import Login from './app/user/Login'
import app from './app/Application'

const reducerCreate = (params) => {
    const defaultReducer = Reducer(params);
    return (state, action) => {
        return defaultReducer(state, action);
    }
}

class BeaconRN extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        CodePush.sync();
    }

    render() {
        return (
            <Router createReducer={reducerCreate}>
                <Scene
                    key="Home"
                    component={Home}
                    title="Home"
                    initial={true}
                    hideNavBar={true} />
                <Scene
                    direction="vertical"
                    key="login"
                    component={Login}
                    title="Login"
                    hideNavBar={true}
                    panHandlers={null} />
            </Router>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"transparent",
        justifyContent: "center",
        alignItems: "center",
    }
})

AppRegistry.registerComponent('BeaconRN', () => BeaconRN);

/**
 * created by schiller, build with code-push
 */
// gaolong:~ schiller$ code-push app add BeaconRN
// Successfully added the "BeaconRN" app, along with the following default deployments:
// ┌────────────┬───────────────────────────────────────┐
// │ Name       │ Deployment Key                        │
// ├────────────┼───────────────────────────────────────┤
// │ Production │ DxbmA0BUTCnh3FXr6U4am3dtmNl6NyGfqThbb │
// ├────────────┼───────────────────────────────────────┤
// │ Staging    │ K_xt4-gfGx4DP9Hi8tx6wwrDpVoTNyGfqThbb │
// └────────────┴───────────────────────────────────────┘
