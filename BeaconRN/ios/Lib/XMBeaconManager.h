//
//  XMBeaconManager.h
//  XMMuseum
//
//  Created by 何振东 on 14-6-16.
//  Copyright (c) 2014年 XM. All rights reserved.
//

#import <Foundation/Foundation.h>
#import <CoreLocation/CoreLocation.h>
#import <CoreBluetooth/CoreBluetooth.h>
#import "BRAppConfig.h"

/**
 *  Beacon管理器
 */

/// 定义基站标志位
static NSString *const kUUID = @"FDA50693-A4E2-4FB1-AFCF-C6EB07647825";
static NSString *const kIdentifier = @"com.xunmi.xm_museum";

@interface XMBeaconManager : NSObject
/// beacon监控类
@property (strong, nonatomic, readonly) CLLocationManager *locationManager;
@property (strong, nonatomic, readonly) CLBeaconRegion    *beaconRegion;
/// 蓝牙管理器
@property (strong, nonatomic, readonly) CBPeripheralManager *peripheralManager;

/// 找到最近的beacon基站代理
@property (nonatomic, strong) CLBeacon *nearestBeacon;
@property (copy, nonatomic) void (^findNearestBeacon) (CLBeacon *beacon);
/// 当进入基站区域时的代理
@property (copy, nonatomic) void (^enterRegion) (CLBeacon *beacon);
/// 退出基站区域时的代理
@property (copy, nonatomic) void (^exitRegion) (CLBeacon  *beacon);
/// 蓝牙状态发生变化时代理
@property (copy, nonatomic) void (^bluetoothStateChanged) (CBPeripheralManagerState state);
/// 返回所有的基站信息
@property (copy, nonatomic) void (^allBeacons) (NSArray *beacons);

/**
 *  共享单例生成beacon管理器
 *
 *  @return beaconManager单例
 */
+ (instancetype)sharedBeacon;

/**
 *  启动/停止监听beacon
 */
- (void)startMonitor;
- (void)stopMonitor;

@end
