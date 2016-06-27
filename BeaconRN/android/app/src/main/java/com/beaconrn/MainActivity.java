package com.beaconrn;

import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.RemoteException;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.ReactActivity;
import com.microsoft.codepush.react.CodePush;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import java.io.File;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import com.facebook.react.bridge.WritableNativeMap;
import com.memory.cmnobject.bll.DataStoreOpt;
import com.mob.smssdk.SMSVerifyUtil;

import cn.sharesdk.framework.ShareSDK;

public class MainActivity extends ReactActivity {

    private Handler mHandler = new Handler() {
        public void handleMessage(Message msg) {
            WritableNativeMap map = new WritableNativeMap();
            switch (msg.what) {
                case ReactNativeDefine.Handler_Root_RNInited: {
                    //updateReactRootView(mCurrentTab);
                    break;
                }
                case SMSVerifyUtil.Handler_GetSMSCode_Success: {
                    Toast.makeText(MainActivity.this, "获取验证码成功！", Toast.LENGTH_SHORT).show();
                    break;
                }
                case SMSVerifyUtil.Handler_GetSMSCode_Failure: {
                    Toast.makeText(MainActivity.this, "获取验证码失败：" + (String) msg.obj + "!", Toast.LENGTH_SHORT).show();
                    break;
                }
                case SMSVerifyUtil.Handler_VerifySMSCode_Success: {
                    com.facebook.react.bridge.Callback callback = (com.facebook.react.bridge.Callback) DataStoreOpt.getInstance().getDataStore(ReactNativeDefine.DataStoreId_CallBack_SMS_Verify);
                    map.putBoolean("statu", true);
                    if (callback != null) {
                        callback.invoke(map);
                    }
                    Toast.makeText(MainActivity.this, "验证码校验成功！", Toast.LENGTH_SHORT).show();
                    break;
                }
                case SMSVerifyUtil.Handler_VerifySMSCode_Failure: {
                    com.facebook.react.bridge.Callback callback = (com.facebook.react.bridge.Callback) DataStoreOpt.getInstance().getDataStore(ReactNativeDefine.DataStoreId_CallBack_SMS_Verify);
                    map.putBoolean("statu", false);
                    if (callback != null) {
                        callback.invoke(map);
                    }
                    Toast.makeText(MainActivity.this, "验证码校验失败：" + (String) msg.obj + "!", Toast.LENGTH_SHORT).show();
                    break;
                }
                default:
                    break;
            }

            super.handleMessage(msg);
        }
    };

    @Override
    protected void onDestroy()
    {
        super.onDestroy();
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        ReactNativeOpt.getInstance().setContext(this);
        ReactNativeOpt.getInstance().setRootHandler(mHandler);
//        ShareSDK.initSDK(this);
//        SMSVerifyUtil.getInstance().initSdk(this, mHandler, "129e51b1d1284", "eec9239ef594bd0dc6727c634a57d58c");
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "BeaconRN";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new CodePush("DxbmA0BUTCnh3FXr6U4am3dtmNl6NyGfqThbb", this, BuildConfig.DEBUG),
            new AppReactPackage()

        );
    }

}
