package com.beaconrn;

import android.app.Activity;
import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.Nullable;
import android.text.Html;
import android.text.Layout;
import android.text.method.ScrollingMovementMethod;
import android.view.View;
import android.view.ViewGroup;
import android.view.ViewTreeObserver;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.ActionMenuView;
import android.widget.LinearLayout;
import android.widget.TextView;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableNativeMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.views.webview.ReactWebViewManager;
import com.memory.cmnobject.bll.CmnObjectDefines;
import com.memory.cmnobject.bll.CmnObjectFuncs;
import com.memory.cmnobject.bll.DataStoreOpt;
import com.memory.cmnobject.bll.func.LogUtil;
import com.memory.cmnobject.bll.func.Util;
import com.memory.cmnobject.bll.http.IhttpUpLoadListener;
import com.memory.cmnobject.vo.UploadFileBean;
import com.mob.sharesdk.ShareDialog;
import com.mob.smssdk.SMSVerifyUtil;

import org.altbeacon.beacon.Beacon;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.HashMap;

import cn.sharesdk.onekeyshare.OnekeyShare;

/**
 * Created by admin on 16/1/7.
 */
public class ReactNativeOpt implements IhttpUpLoadListener {
    private static ReactNativeOpt sInstance = null;
    private Callback callback;
    private Context mContext = null;
    private final int WEBVIEW_CODE = 0x02;
    private ReactInstanceManager mReactInstanceManager = null;
    private ReactApplicationContext mReactApplicationContext = null;
    //    private ReactRootView mReactRootView=null;
    private Handler mRootHandler = null;

    public synchronized static ReactNativeOpt getInstance() {
        if (sInstance == null)
            sInstance = new ReactNativeOpt();

        return sInstance;
    }

    public ReactInstanceManager getReactInstanceManager() {
        return mReactInstanceManager;
    }

    public void setReactInstanceManager(ReactInstanceManager manager) {
        mReactInstanceManager = manager;
    }

    public void setContext(Context context) {
        mContext = context;
    }

    public void setRootHandler(Handler rootHandler) {
        mRootHandler = rootHandler;
    }

    public ReactApplicationContext getReactApplicationContext() {
        return mReactApplicationContext;
    }

    public void updateReactApplicationContext(ReactApplicationContext reactApplicationContext) {
        mReactApplicationContext = reactApplicationContext;
    }

    public void sendEvent(ReactContext reactContext,
                          String eventName, @Nullable WritableMap params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public void getSMSCode(String phoneNum) {
        SMSVerifyUtil.getInstance().getSMS(phoneNum);
    }

    public void sendSMS(String phoneNum, String title, String content) {
        CmnObjectFuncs.sendMSM(phoneNum, content, mContext);
    }

    public void verifySMSCode(String phoneNum, String code) {
        SMSVerifyUtil.getInstance().virifySMS(phoneNum, code);
    }

    public void doShare(String content, String link) {
        ShareDialog.getInstance().updateContext(mContext);
        LogUtil.logI(content + link);
        ShareDialog.getInstance().updateData(content, content, link, link, "", "");
        ShareDialog.getInstance().show();
    }

    public void downloadFile(String url, String filePath, Callback callback) {
//        HttpDownLoadInfoRN httpDownLoadInfo = new HttpDownLoadInfoRN(url,  filePath, mDownLoadCallback,callback);
//        HttpDownLoadThreadRN.getInstance().appendQueue(httpDownLoadInfo);

    }

    public void startMonitor(Beacon beacon) {

    }

    public void fileExistsAtPath(String filePath, Callback callback) {
        File file = new File(filePath);

        JSONObject jsonObject = new JSONObject();
        try {
            if (file.exists())
                jsonObject.put("result", true);
            else
                jsonObject.put("result", false);

            callback.invoke(jsonObject.toString());
        } catch (JSONException e) {
            e.printStackTrace();
        }

    }

    public void uploadFile(String filePath, String url, String fileName, ReadableMap param, Callback callback) {
        this.callback = callback;
        UploadFileBean bean = new UploadFileBean();
        bean.setUrl(url);
        bean.setFileName(fileName);
        filePath = filePath.replace("file://", "");
        bean.setFilePath(filePath);

        String id = param.getString("user_id");
        try {
            Util.uploadFile(bean, mContext, id, this);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public void onSuccess(String value) {
        WritableNativeMap map = new WritableNativeMap();
        map.putBoolean("status", true);
        try {
            JSONObject object = new JSONObject(value);
            JSONArray objectArrayContent = object.getJSONArray("content");
            if (objectArrayContent != null && objectArrayContent.length() > 0) {
                JSONObject objectContent = objectArrayContent.getJSONObject(0);
                WritableNativeMap mapData = new WritableNativeMap();
                mapData.putString("error_code", object.getString("error_code"));
                WritableNativeArray array = new WritableNativeArray();
                WritableNativeMap arrayItemMap = new WritableNativeMap();
                arrayItemMap.putString("path", objectContent.getString("path"));
                arrayItemMap.putString("size", objectContent.getString("size"));
                arrayItemMap.putString("ext", objectContent.getString("ext"));
                arrayItemMap.putString("file_name", objectContent.getString("file_name"));
                array.pushMap(arrayItemMap);
                mapData.putArray("content", array);
                map.putMap("data", mapData);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        callback.invoke(map);
    }

    @Override
    public void onFailure() {
        WritableNativeMap map = new WritableNativeMap();
        map.putBoolean("status", true);
        callback.invoke(map);
    }

}
