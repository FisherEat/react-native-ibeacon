import React from 'react-native'

const {
    StyleSheet,
    Component,
    NativeModules,
} = React

const Springboard = NativeModules.SpringBoardApiModule

function downloadFile(fileUrl, toPath, callback) {
    // Springboard.downloadFile(fileUrl, toPath, callback)
}

function fileExistsAtPath(filePath, callback) {
    // Springboard.fileExistsAtPath(filePath, callback)
}

function startMonitor(callback) {
    // Springboard.startMonitorCallBack(callback)
}

function stopMonitor(callback) {
    // Springboard.stopMonitorCallBack(callback)
}

function openShareView(content, linkText, callback) {
    Springboard.doShare(content, linkText, callback)
}

export default {
    downloadFile,
    fileExistsAtPath,
    startMonitor,
    stopMonitor,
    openShareView,
}
