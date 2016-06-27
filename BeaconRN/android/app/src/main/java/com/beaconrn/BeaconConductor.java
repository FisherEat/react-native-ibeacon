package com.beaconrn;

import android.app.Application;
import android.content.Context;
import android.content.Intent;
import android.content.ServiceConnection;
import android.os.Bundle;
import android.os.RemoteException;
import android.util.Log;

import com.facebook.react.bridge.ReactContext;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.Collection;

import org.altbeacon.beacon.Beacon;
import org.altbeacon.beacon.BeaconConsumer;
import org.altbeacon.beacon.BeaconParser;
import org.altbeacon.beacon.MonitorNotifier;
import org.altbeacon.beacon.RangeNotifier;
import org.altbeacon.beacon.Region;
import org.altbeacon.beacon.BeaconManager;


/**
 * Created by HZD on 16/6/20.
 */

public class BeaconConductor extends Application implements BeaconConsumer {
    protected static final String TAG = "MonitoringActivity";
    /** 重新调整格式*/
    public static final String IBEACON_FORMAT = "m:2-3=0215,i:4-19,i:20-21,i:22-23,p:24-24";
    /** 设置兴趣UUID*/
    public static final String FILTER_UUID = "FDA50693-A4E2-4FB1-AFCF-C6EB07647825";

    private BeaconManager beaconManager;

    public ReactContext reactContext;

    static BeaconConductor getApplication;

    @Override
    public void onCreate() {
        super.onCreate();

        beaconManager = BeaconManager.getInstanceForApplication(this);
        beaconManager.getBeaconParsers().add(new BeaconParser().setBeaconLayout(IBEACON_FORMAT));
        beaconManager.bind(this);
        getApplication = this;
    }

    @Override
    public void onBeaconServiceConnect()
    {
        beaconManager.setMonitorNotifier(new MonitorNotifier()
        {
            @Override
            public void didEnterRegion(Region region)
            {
                Log.e(TAG, "I just saw an beacon for the first time!");
            }

            @Override
            public void didExitRegion(Region region)
            {
                Log.e(TAG, "I no longer see an beacon");
            }

            @Override
            public void didDetermineStateForRegion(int state, Region region)
            {
                Log.e(TAG, "I have just switched from seeing/not seeing beacons: " + state);
            }
        });

        beaconManager.setRangeNotifier(new RangeNotifier() {
            @Override
            public void didRangeBeaconsInRegion(Collection<Beacon> beacons, Region region) {
                Log.e(TAG, "I found lot of beacon");
                for (Beacon beacon : beacons) {
                    Log.i(TAG, "The first beacon I see is about "+beacon.getDistance()+" meters away.");

                }

                ReactContext reactContext = (ReactContext)getApplicationContext();
//                reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit("refreshData", beacons.iterator().next());
            }
        });

        try
        {
            //开始监视
            beaconManager.startMonitoringBeaconsInRegion(new Region(FILTER_UUID, null, null, null));
            beaconManager.startRangingBeaconsInRegion(new Region(FILTER_UUID, null, null, null));
        }
        catch (RemoteException e)
        {
            e.printStackTrace();
        }

    }
}


