//
//  XMNotificationManager.h
//  XMMuseum
//
//  Created by 何振东 on 14-7-3.
//  Copyright (c) 2014年 XM. All rights reserved.
//

#import <Foundation/Foundation.h>

/**
 *  应用级推送通知管理类，包括本地通知和远程通知。
 */


@interface XMNotificationManager : NSObject

+ (instancetype)sharedInstance;

/**
 *  靠近基站区域时提示
 */
- (void)showEnterBeaconRangeNotification;

/**
 *  离开基站区域时提示
 */
- (void)showExitBeaconRangeNotification;

/**
 *  自定义提示消息
 *
 *  @param message 消息内容
 */
- (void)showNotificationWithMessage:(NSString *)message;

/**
 *  播放系统声音、震动提示等
 */
- (void)playSystemSound;
- (void)playVibrate;
- (void)playSystemSoundAndVibrate;

@end
