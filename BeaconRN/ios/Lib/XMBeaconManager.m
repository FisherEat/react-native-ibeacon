//
//  XMBeaconManager.m
//  XMMuseum
//
//  Created by 何振东 on 14-6-16.
//  Copyright (c) 2014年 XM. All rights reserved.
//

#import "XMBeaconManager.h"
#import "XMNotificationManager.h"
#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>
#import "AppDelegate.h"
#import "RCTBridge.h"
#import "RCTBridgeModule.h"
#import "RCTEventDispatcher.h"

//#define kUUID @"B9407F30-F5F8-466E-AFF9-25556B57FE6D"
//#define kIdentifier [[NSBundle mainBundle] bundleIdentifier]

static NSInteger count = 0; //计数

@interface XMBeaconManager () <CLLocationManagerDelegate, CBPeripheralManagerDelegate>
@property (strong, nonatomic) CLLocationManager   *locationManager;
@property (strong, nonatomic) CLBeaconRegion      *beaconRegion;

/// 用于排除偏差数据，将搜索到的5次最近的beacon基站信息放数，如果第一个数据在数组中出现的次数超过3次，则视为正常数据，否则不作处理
@property (strong, nonatomic) NSMutableArray      *beaconFilters;

@property (strong, nonatomic) CBPeripheralManager *peripheralManager;

/// 存储弹出警告框
@property (strong, nonatomic) NSMutableArray      *alertViews;
//计时器
@property (strong, nonatomic) NSTimer *showBeaconTimer;

@end

@implementation XMBeaconManager

+ (instancetype)sharedBeacon
{
    static XMBeaconManager *beacon = nil;
    if (!beacon) {
        beacon = [[XMBeaconManager alloc] init];
    }
    return beacon;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
        self.alertViews = @[].mutableCopy;
        
        self.beaconFilters = @[].mutableCopy;
        self.locationManager = [[CLLocationManager alloc] init];
        self.locationManager.activityType = CLActivityTypeFitness;
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBest;
        self.locationManager.distanceFilter = kCLDistanceFilterNone;
        self.locationManager.delegate = self;
        if ([self.locationManager respondsToSelector:@selector(requestWhenInUseAuthorization)]) {
            [self.locationManager requestWhenInUseAuthorization];
        }

        NSUUID *uuid = [[NSUUID alloc] initWithUUIDString:kUUID];
        self.beaconRegion = [[CLBeaconRegion alloc] initWithProximityUUID:uuid identifier:kIdentifier];
        self.beaconRegion.notifyEntryStateOnDisplay = YES;
        
        self.peripheralManager = [[CBPeripheralManager alloc] initWithDelegate:self queue:dispatch_get_main_queue()];
    }
    return self;
}


- (void)startMonitor
{
    if ([CLLocationManager isMonitoringAvailableForClass:[CLBeaconRegion class]]) {
        [self.locationManager startMonitoringForRegion:self.beaconRegion];
        [self.locationManager startRangingBeaconsInRegion:self.beaconRegion];
        [self.locationManager requestStateForRegion:self.beaconRegion];
    }else {
        mAlertView(@"提示", @"您的设置不支持iBeacon服务！");
    }
}

- (void)stopMonitor
{
    [self.locationManager stopMonitoringForRegion:self.beaconRegion];
    [self.locationManager stopRangingBeaconsInRegion:self.beaconRegion];
    [self.locationManager stopUpdatingLocation];
}


- (BOOL)isBlueToothOpen
{
    BOOL result = NO;
    if ([CLLocationManager locationServicesEnabled]) {
        result = YES;
    }
    return result;
}

- (void)refreshDataWith:(NSArray<CLBeacon *> *)beacon
{
  AppDelegate *delegate = [AppDelegate appDelegate];
  RCTBridge *bridge = [delegate bridge];
  NSDictionary *paramDic = [self beaconsDic:beacon];
  if (!self.showBeaconTimer) {
    self.showBeaconTimer = [NSTimer scheduledTimerWithTimeInterval:1 target:self selector:@selector(showBeaconTimer:) userInfo:nil repeats:YES];
    [self.showBeaconTimer fire];
    //每隔6秒请求一次服务端
    [bridge.eventDispatcher sendDeviceEventWithName:@"refreshData" body:paramDic];
  }
}

- (NSDictionary *)beaconsDic:(NSArray<CLBeacon *> *)beaconArray
{
    NSMutableArray *paramsArray = [NSMutableArray array];
    [beaconArray enumerateObjectsUsingBlock:^(CLBeacon * _Nonnull obj, NSUInteger idx, BOOL * _Nonnull stop) {
        if (obj.proximity != CLProximityUnknown) {
            [paramsArray addObject:@{@"uuid": NSSTRING_NOT_NIL(obj.proximityUUID.UUIDString),
                                     @"major": NSSTRING_NOT_NIL(obj.major.stringValue),
                                     @"minor": NSSTRING_NOT_NIL(obj.minor.stringValue),
                                     @"rssi": @(obj.rssi),
                                     @"distance": @(obj.accuracy)
                                     }];
        }
    }];
    
    NSDictionary *paramDic = @{@"beacons": paramsArray};
    
    return paramDic;
}

- (void)showBeaconTimer:(NSTimer *)timer
{
  count ++;
  if (count >= 6) {
    count=0;
    [self.showBeaconTimer invalidate];
    self.showBeaconTimer = nil;
  }
}

#pragma mark - delegate

- (void)locationManager:(CLLocationManager *)manager didDetermineState:(CLRegionState)state forRegion:(CLRegion *)region
{
    NSLog(@"state:%zd", state);
}

- (void)locationManager:(CLLocationManager *)manager didEnterRegion:(CLRegion *)region
{
    [[XMNotificationManager sharedInstance] showEnterBeaconRangeNotification];
}

- (void)locationManager:(CLLocationManager *)manager didExitRegion:(CLRegion *)region
{
    [[XMNotificationManager sharedInstance] showExitBeaconRangeNotification];
}

- (void)locationManager:(CLLocationManager *)manager didRangeBeacons:(NSArray *)beacons inRegion:(CLBeaconRegion *)region
{
    /// 获取所有rssi不为0的beacon
    if (self.allBeacons) {
        NSMutableArray *array = @[].mutableCopy;
        for (CLBeacon *beacon in beacons) {
            if (beacon.accuracy > 0) {
                [array addObject:beacon];
            }
        }
        self.allBeacons(array);
    }
    
    /// 找到距离接收者最近且rssi不为0的一个发射beacon，并返回，若没有，则返回nil
    CLBeacon *nearestBeacon = nil;
    if (beacons.count > 0) {
        for (CLBeacon *beacon in beacons) {
            if (beacon.accuracy > 0) {
                nearestBeacon = beacon;
                break;
            }
        }
    }

    self.nearestBeacon = nearestBeacon;
    //刷新用户位置
    if (beacons.count > 0) {
        [self refreshDataWith:beacons];
    }
  
    if (self.findNearestBeacon) {
        self.findNearestBeacon(nearestBeacon);
    }
}

- (void)locationManager:(CLLocationManager *)manager didFailWithError:(NSError *)error
{
    NSLog(@"error:%@", error);
}

- (void)locationManager:(CLLocationManager *)manager rangingBeaconsDidFailForRegion:(CLBeaconRegion *)region withError:(NSError *)error
{
    NSLog(@"error:%@", error);
}


#pragma  mark - CBPeripheralManagerDelegate

- (void)peripheralManagerDidUpdateState:(CBPeripheralManager *)peripheral
{    
    switch (peripheral.state) {
        case CBPeripheralManagerStateUnauthorized:
        {
            UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"提示" message:@"需要您授权使用蓝牙才能提供完整的功能体验！您可以前往设置->隐私->蓝牙共享里，打开授权！" delegate:nil cancelButtonTitle:@"确定" otherButtonTitles:nil, nil];

            [alert show];
            [self.alertViews addObject:alert];
        }
            break;
        case CBPeripheralManagerStatePoweredOff:
        {
          mAlertView(@"温馨提示", @"请打开蓝牙");
//            [XMProgressHUD showTips:@"请打开蓝牙享受寻觅物联体验！" delay:3];
            
        }
            break;
        case CBPeripheralManagerStatePoweredOn:
        {
            for (UIAlertView *alertView in self.alertViews) {
                [alertView dismissWithClickedButtonIndex:0 animated:YES];
            }
           // [[XMProgressHUD sharedInstance] hideProgress];
        }
            break;
        default:
            break;
    }
    if (self.bluetoothStateChanged) {
        self.bluetoothStateChanged(peripheral.state);
    }
}

@end
