package com.beaconrn;

import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Message;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.MapBuilder;
import com.memory.cmnobject.bll.CmnObjectFuncs;
import com.memory.cmnobject.bll.DataStoreOpt;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by admin on 16/1/7.
 */
public class SpringBoardApiModule extends ReactContextBaseJavaModule {
    private static final String MODULE_NAME = "SpringBoardApiModule";
    private ReactApplicationContext reactContext;

    public SpringBoardApiModule(ReactApplicationContext reactContext) {
        super(reactContext);
        ReactNativeOpt.getInstance().updateReactApplicationContext(reactContext);

        BeaconConductor beaconConductor = BeaconConductor.getApplication;
        beaconConductor.reactContext = reactContext;

    }

    @Override
    public String getName() {
        return MODULE_NAME;
    }

    @Override
    public Map<String, Object> getConstants() {
        final Map<String, Object> constants = MapBuilder.newHashMap();

        constants.put("docPath", CmnObjectFuncs.getInnerSDCardPath() + "/XTMedic");
        return constants;
    }

    @ReactMethod
    public void downloadFile(String url, String filePath, Callback callback) {
        ReactNativeOpt.getInstance().downloadFile(url, filePath, callback);
    }

    @ReactMethod
    public void fileExistsAtPath(String filePath, Callback callback) {
        ReactNativeOpt.getInstance().fileExistsAtPath(filePath, callback);

    }

    @ReactMethod
    public void updateContext() {
        ReactNativeOpt.getInstance().updateReactApplicationContext(reactContext);
    }


    @ReactMethod
    public void sendVerifyCodeToPhoneNumber(String phoneNum, Callback callback) {
        ReactNativeOpt.getInstance().getSMSCode(phoneNum);
    }

    @ReactMethod
    public void sendSMS(String phoneNum, String title, String content, Callback callback) {
        ReactNativeOpt.getInstance().sendSMS(phoneNum, title, content);
    }

    @ReactMethod
    public void commitVerifyCode(String code, String phoneNum, Callback callback) {
        DataStoreOpt.getInstance().createDataStore(ReactNativeDefine.DataStoreId_CallBack_SMS_Verify, DataStoreOpt.Object);
        DataStoreOpt.getInstance().updateDataStore(ReactNativeDefine.DataStoreId_CallBack_SMS_Verify, callback);
        ReactNativeOpt.getInstance().verifySMSCode(phoneNum, code);
    }

    @ReactMethod
    public void doShare(String content, String link, Callback callback) {
        ReactNativeOpt.getInstance().doShare(content, link);
    }


    @ReactMethod
    public void uploadFile(String filePath, String filename, int fileType, ReadableMap params, String url, Callback callback) {
        ReactNativeOpt.getInstance().uploadFile(filePath, url, filename, params, callback);
    }

}
