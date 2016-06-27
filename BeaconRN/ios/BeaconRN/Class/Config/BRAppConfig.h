//
//  BRAppConfig.h
//  BeaconRN
//
//  Created by gaolong on 16/5/25.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#import <Foundation/Foundation.h>

//简单的以AlertView显示提示信息
#define mAlertView(title, msg) \
UIAlertView *alert = [[UIAlertView alloc] initWithTitle:title message:msg delegate:nil \
cancelButtonTitle:@"确定" \
otherButtonTitles:nil]; \
[alert show];

//----------方法简写-------
#define mAppDelegate        (AppDelegate *)[[UIApplication sharedApplication] delegate]
#define mWindow             [[[UIApplication sharedApplication] windows] lastObject]
#define mKeyWindow          [[UIApplication sharedApplication] keyWindow]
#define mUserDefaults       [NSUserDefaults standardUserDefaults]
#define mNotificationCenter [NSNotificationCenter defaultCenter]
#define kFont(size) [UIFont systemFontOfSize:size]
#define kB_Font(size) [UIFont boldSystemFontOfSize:size]

#define NSSTRING_NOT_NIL(value)  value ? value : @""

// block self
#define mWeakSelf  __weak typeof (self)weakSelf = self;
#define mStrongSelf typeof(weakSelf) __strong strongSelf = weakSelf;

/// 存储是否接受推送通知、是否有声音提示、是否震动提示，值为bool类型，程序第一次安装时，初始化为YES
static NSString *const kReceiveNotificationKey            = @"receiveNotificationKey";
static NSString *const kReceiveNotificationWithSoundKey   = @"receiveNotificationWithSoundKey";
static NSString *const kReceiveNotificationWithVibrateKey = @"receiveNotificationWithVibrateKey";