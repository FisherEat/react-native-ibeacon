//
//  Params-local.h
//  BeaconRN
//
//  Created by 何振东 on 16/6/13.
//  Copyright © 2016年 Facebook. All rights reserved.
//

#ifndef Params_local_h
#define Params_local_h

#if DEBUG // 调试模式
   
    #if TARGET_IPHONE_SIMULATOR //模拟器
        static NSString *const jsCodeLocation = @"http://localhost:8081/index.ios.bundle?platform=ios&dev=true";
    #elif TARGET_OS_IPHONE  //真机
        static NSString *const jsCodeLocation = @"http://192.168.0.108:8081/index.ios.bundle?platform=ios&dev=true";
    #endif

    #define kJSCodeLocationURL [NSURL URLWithString:jsCodeLocation]

#else  // 发布模式
    #define kJSCodeLocationURL [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"]
#endif


#endif
