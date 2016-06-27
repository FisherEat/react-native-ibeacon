//
//  BRSpringboard.m
//  BeaconRN
//
//  Created by gaolong on 16/5/25.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import "BRSpringboard.h"
#import "XMBeaconManager.h"
#import "CodePush.h"
#import "Params-local.h"

@implementation BRSpringboard
RCT_EXPORT_MODULE();

+ (RCTRootView *)rctRootViewWithClassname:(NSString *)classname {
    RCTRootView *rootView = [[RCTRootView alloc] initWithBundleURL:kJSCodeLocationURL
                                                        moduleName:@"BeaconRN"
                                                 initialProperties:nil
                                                     launchOptions:nil];
    rootView.frame = [UIScreen mainScreen].bounds;
    return rootView;
}

RCT_EXPORT_METHOD(startMonitorCallBack:(RCTResponseSenderBlock)callback) {
    [[XMBeaconManager sharedBeacon] startMonitor];
    callback(@[@"start"]);
}

RCT_EXPORT_METHOD(stopMonitorCallBack:(RCTResponseSenderBlock)callback) {
    [[XMBeaconManager sharedBeacon] stopMonitor];
}

RCT_EXPORT_METHOD(bluetoothStateChanged:(RCTResponseSenderBlock)callback) {
    [XMBeaconManager sharedBeacon].bluetoothStateChanged = ^(CBPeripheralManagerState state) {
        
    };
}

RCT_EXPORT_METHOD(enterRegion:(RCTResponseSenderBlock)callback) {
    [XMBeaconManager sharedBeacon].enterRegion = ^(CLBeacon *beacon) {
        
    };
}

RCT_EXPORT_METHOD(exitRegion:(RCTResponseSenderBlock)callback) {
    [XMBeaconManager sharedBeacon].enterRegion = ^(CLBeacon *beacon) {
        
    };
}

RCT_EXPORT_METHOD(findNearestBeacon:(RCTResponseSenderBlock)callback) {
    [[XMBeaconManager sharedBeacon] startMonitor];
    CLBeacon *beacon = [XMBeaconManager sharedBeacon].nearestBeacon;
    if (beacon) {
        callback(@[@{@"uuid":NSSTRING_NOT_NIL(beacon.proximityUUID.UUIDString),
                     @"major":NSSTRING_NOT_NIL(beacon.major.stringValue),
                     @"minor":NSSTRING_NOT_NIL(beacon.minor.stringValue)
                  }]);
    }
}

- (dispatch_queue_t)methodQueue {
    return dispatch_get_main_queue();
}

@end
