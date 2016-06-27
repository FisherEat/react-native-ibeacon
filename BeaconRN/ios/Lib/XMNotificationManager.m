//
//  XMNotificationManager.m
//  XMMuseum
//
//  Created by 何振东 on 14-7-3.
//  Copyright (c) 2014年 XM. All rights reserved.
//

#import "XMNotificationManager.h"
#import "BRAppConfig.h"
#import <UIKit/UIKit.h>
#import <AudioToolbox/AudioToolbox.h>

/// 上次发通知的时间
static NSString *const kLastDateSendNotification = @"lastDateSendNotification";

@interface XMNotificationManager ()


@end


@implementation XMNotificationManager

+ (instancetype)sharedInstance
{
    static XMNotificationManager *manager = nil;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        manager = [[XMNotificationManager alloc] init];
    });
    return manager;
}

- (instancetype)init
{
    self = [super init];
    if (self) {
    }
    return self;
}

- (void)showEnterBeaconRangeNotification
{
    NSDate *lastDate = [mUserDefaults objectForKey:kLastDateSendNotification];
    if (lastDate) {
        NSTimeInterval timeInterval = [[NSDate date] timeIntervalSinceDate:lastDate];
        if (timeInterval < 60 * 60) {
            return;
        }
    }

    [mUserDefaults setObject:[NSDate date] forKey:kLastDateSendNotification];
    [mUserDefaults synchronize];

    UILocalNotification *notice = [[UILocalNotification alloc] init];
    notice.alertBody = @"欢迎您来到寻觅生活服务区！";
    notice.soundName = UILocalNotificationDefaultSoundName;
    [[UIApplication sharedApplication] scheduleLocalNotification:notice];
}

- (void)showExitBeaconRangeNotification
{
    NSDate *lastDate = [mUserDefaults objectForKey:kLastDateSendNotification];
    if (lastDate) {
        NSTimeInterval timeInterval = [[NSDate date] timeIntervalSinceDate:lastDate];
        if (timeInterval < 60) {
            return;
        }
    }
    [mUserDefaults setObject:[NSDate date] forKey:kLastDateSendNotification];
    [mUserDefaults synchronize];

    UILocalNotification *notice = [[UILocalNotification alloc] init];
    notice.alertBody   = @"寻觅xBeacon提醒您已离开灯塔区域！";
    notice.soundName   = UILocalNotificationDefaultSoundName;
    [[UIApplication sharedApplication] scheduleLocalNotification:notice];
}

- (void)showNotificationWithMessage:(NSString *)message
{
    BOOL receive = [mUserDefaults boolForKey:kReceiveNotificationKey];
    if (!receive) {
        return;
    }
    
    UILocalNotification *notice = [[UILocalNotification alloc] init];
    notice.alertBody   = message;
    notice.soundName   = UILocalNotificationDefaultSoundName;
    [[UIApplication sharedApplication] scheduleLocalNotification:notice];
}

- (void)playSystemSoundAndVibrate
{
    BOOL receive = [mUserDefaults boolForKey:kReceiveNotificationKey];
    if (!receive) {
        return;
    }

    if ([mUserDefaults boolForKey:kReceiveNotificationWithSoundKey]) {
        [self playSystemSound];
    }
    
    if ([mUserDefaults boolForKey:kReceiveNotificationWithVibrateKey]) {
        [self playVibrate];
    }
}

- (void)playSystemSound
{
    SystemSoundID sound = 0;
    NSString *path = [NSString stringWithFormat:@"/System/Library/Audio/UISounds/%@.%@", @"ReceivedMessage", @"caf"];
    //[[NSBundle bundleWithIdentifier:@"com.apple.UIKit" ]pathForResource:soundName ofType:soundType];//得到苹果框架资源UIKit.framework ，从中取出所要播放的系统声音的路径
    //[[NSBundle mainBundle] URLForResource: @"tap" withExtension: @"aif"];  获取自定义的声音
    if (path) {
        OSStatus error = AudioServicesCreateSystemSoundID((CFURLRef)CFBridgingRetain([NSURL fileURLWithPath:path]), &sound);
        if (error != kAudioServicesNoError) {//获取的声音的时候，出现错误
            NSLog(@"error:%d", (int)error);
        }
    }
    AudioServicesPlaySystemSound(sound);
}

- (void)playVibrate
{
    SystemSoundID sound = kSystemSoundID_Vibrate;
    AudioServicesPlaySystemSound(sound);
}

@end
